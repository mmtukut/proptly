-- Create profiles table
create table if not exists public.profiles (
    id uuid references auth.users on delete cascade primary key,
    email text unique not null,
    phone text,
    account_type text check (account_type in ('personal', 'agent', 'developer')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    email_verified boolean default false not null,
    saved_properties jsonb default '[]'::jsonb not null,
    search_history jsonb default '[]'::jsonb not null,
    preferences jsonb default '{"notifications": true, "newsletter": true}'::jsonb not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for better performance
create index if not exists profiles_email_idx on public.profiles(email);
create index if not exists profiles_account_type_idx on public.profiles(account_type);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Public profiles are viewable by everyone." on public.profiles;
drop policy if exists "Users can insert their own profile." on public.profiles;
drop policy if exists "Users can update own profile." on public.profiles;

-- Create policies with better security
create policy "Public profiles are viewable by everyone."
    on public.profiles for select
    using ( true );

create policy "Users can insert their own profile."
    on public.profiles for insert
    with check ( 
        auth.uid() = id 
        and email = auth.email()
    );

create policy "Users can update own profile."
    on public.profiles for update using (
        auth.uid() = id
    );

-- Create triggers for updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

drop trigger if exists on_profiles_updated on public.profiles;
create trigger on_profiles_updated
    before update on public.profiles
    for each row
    execute procedure public.handle_updated_at();

-- Grant permissions
grant usage on schema public to authenticated;
grant usage on schema public to anon;

grant all on public.profiles to authenticated;
grant select on public.profiles to anon;

-- Create function to handle new user creation
create or replace function public.handle_new_user()
returns trigger as $$
declare
  raw_metadata jsonb;
begin
    -- Extract metadata from the raw user data
    raw_metadata := new.raw_user_meta_data;

    -- Insert the new profile with all available data
    insert into public.profiles (
        id,
        email,
        phone,
        account_type,
        created_at,
        email_verified,
        saved_properties,
        search_history,
        preferences
    ) values (
        new.id,
        new.email,
        coalesce(raw_metadata->>'phone', ''),
        coalesce(raw_metadata->>'accountType', 'personal'),
        now(),
        false,
        '[]'::jsonb,
        '[]'::jsonb,
        '{"notifications": true, "newsletter": true}'::jsonb
    );

    return new;
exception when others then
    -- Log the error (this will appear in your Supabase logs)
    raise log 'Error in handle_new_user: %', SQLERRM;
    return new;
end;
$$ language plpgsql security definer;

-- Drop existing trigger if it exists
drop trigger if exists on_auth_user_created on auth.users;

-- Create trigger for new user creation
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user(); 