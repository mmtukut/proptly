-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Create profiles table
create table if not exists public.profiles (
    id uuid references auth.users on delete cascade primary key,
    email text unique not null,
    full_name text,
    phone text,
    avatar_url text,
    account_type text check (account_type in ('personal', 'agent', 'developer')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    email_verified boolean default false not null,
    saved_properties jsonb default '[]'::jsonb not null,
    search_history jsonb default '[]'::jsonb not null,
    preferences jsonb default '{"notifications": true, "newsletter": true}'::jsonb not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create agencies table
create table if not exists public.agencies (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    description text,
    logo_url text,
    website text,
    phone text,
    email text,
    address text,
    city text,
    state text,
    country text,
    postal_code text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    is_verified boolean default false not null,
    rating decimal(3,2) check (rating >= 0 and rating <= 5),
    total_reviews integer default 0
);

-- Create agents table
create table if not exists public.agents (
    id uuid references auth.users on delete cascade primary key,
    agency_id uuid references public.agencies(id) on delete set null,
    first_name text not null,
    last_name text not null,
    email text unique not null,
    phone text,
    avatar_url text,
    bio text,
    license_number text,
    years_of_experience integer,
    specialties text[],
    languages text[],
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    is_verified boolean default false not null,
    rating decimal(3,2) check (rating >= 0 and rating <= 5),
    total_reviews integer default 0,
    is_active boolean default true not null
);

-- Create properties table
create table if not exists public.properties (
    id uuid default uuid_generate_v4() primary key,
    agent_id uuid references public.agents(id) on delete set null,
    agency_id uuid references public.agencies(id) on delete set null,
    title text not null,
    description text,
    price decimal(12,2) not null,
    location text not null,
    address text not null,
    city text not null,
    state text not null,
    country text not null,
    postal_code text,
    property_type text check (property_type in ('house', 'apartment', 'land', 'commercial')),
    listing_type text check (listing_type in ('sale', 'rent', 'lease')),
    status text check (status in ('available', 'sold', 'rented', 'pending')) default 'available',
    bedrooms integer,
    bathrooms integer,
    area decimal(10,2),
    images jsonb default '[]'::jsonb not null,
    amenities jsonb default '[]'::jsonb not null,
    features jsonb default '[]'::jsonb not null,
    coordinates jsonb default '[]'::jsonb not null,
    date_available date,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    is_verified boolean default false not null,
    views_count integer default 0,
    saved_count integer default 0
);

-- Create inquiries table
create table if not exists public.inquiries (
    id uuid default uuid_generate_v4() primary key,
    property_id uuid references public.properties(id) on delete cascade not null,
    user_id uuid references auth.users on delete cascade not null,
    agent_id uuid references public.agents(id) on delete set null,
    message text,
    status text check (status in ('pending', 'responded', 'closed')) default 'pending',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    last_message_at timestamp with time zone default timezone('utc'::text, now()) not null,
    is_read boolean default false not null
);

-- Create chat_messages table
create table if not exists public.chat_messages (
    id uuid default uuid_generate_v4() primary key,
    inquiry_id uuid references public.inquiries(id) on delete cascade not null,
    sender_id uuid references auth.users on delete cascade not null,
    message text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    is_read boolean default false not null,
    metadata jsonb default '{}'::jsonb not null
);

-- Create property_inquiries table
create table if not exists public.property_inquiries (
    id uuid default uuid_generate_v4() primary key,
    property_id uuid references public.properties(id) on delete cascade not null,
    user_id uuid references public.profiles(id) on delete cascade not null,
    message text,
    status text check (status in ('pending', 'responded', 'closed')) default 'pending',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create property_reviews table
create table if not exists public.property_reviews (
    id uuid default uuid_generate_v4() primary key,
    property_id uuid references public.properties(id) on delete cascade not null,
    user_id uuid references public.profiles(id) on delete cascade not null,
    rating integer check (rating >= 1 and rating <= 5) not null,
    comment text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(property_id, user_id)
);

-- Create property_saved table
create table if not exists public.property_saved (
    id uuid default uuid_generate_v4() primary key,
    property_id uuid references public.properties(id) on delete cascade not null,
    user_id uuid references public.profiles(id) on delete cascade not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(property_id, user_id)
);

-- Create property_views table
create table if not exists public.property_views (
    id uuid default uuid_generate_v4() primary key,
    property_id uuid references public.properties(id) on delete cascade not null,
    user_id uuid references public.profiles(id) on delete cascade,
    ip_address text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for better performance
create index if not exists profiles_email_idx on public.profiles(email);
create index if not exists profiles_account_type_idx on public.profiles(account_type);
create index if not exists agencies_name_idx on public.agencies(name);
create index if not exists agents_agency_id_idx on public.agents(agency_id);
create index if not exists agents_email_idx on public.agents(email);
create index if not exists properties_agent_id_idx on public.properties(agent_id);
create index if not exists properties_agency_id_idx on public.properties(agency_id);
create index if not exists properties_status_idx on public.properties(status);
create index if not exists properties_location_idx on public.properties using gin (to_tsvector('english', location));
create index if not exists inquiries_property_id_idx on public.inquiries(property_id);
create index if not exists inquiries_user_id_idx on public.inquiries(user_id);
create index if not exists inquiries_agent_id_idx on public.inquiries(agent_id);
create index if not exists chat_messages_inquiry_id_idx on public.chat_messages(inquiry_id);
create index if not exists chat_messages_sender_id_idx on public.chat_messages(sender_id);
create index if not exists property_inquiries_property_id_idx on public.property_inquiries(property_id);
create index if not exists property_inquiries_user_id_idx on public.property_inquiries(user_id);
create index if not exists property_reviews_property_id_idx on public.property_reviews(property_id);
create index if not exists property_saved_property_id_idx on public.property_saved(property_id);
create index if not exists property_saved_user_id_idx on public.property_saved(user_id);
create index if not exists property_views_property_id_idx on public.property_views(property_id);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.agencies enable row level security;
alter table public.agents enable row level security;
alter table public.properties enable row level security;
alter table public.inquiries enable row level security;
alter table public.chat_messages enable row level security;
alter table public.property_inquiries enable row level security;
alter table public.property_reviews enable row level security;
alter table public.property_saved enable row level security;
alter table public.property_views enable row level security;

-- Create updated_at trigger function
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger on_profiles_updated
    before update on public.profiles
    for each row
    execute procedure public.handle_updated_at();

create trigger on_agencies_updated
    before update on public.agencies
    for each row
    execute procedure public.handle_updated_at();

create trigger on_agents_updated
    before update on public.agents
    for each row
    execute procedure public.handle_updated_at();

create trigger on_properties_updated
    before update on public.properties
    for each row
    execute procedure public.handle_updated_at();

create trigger on_inquiries_updated
    before update on public.inquiries
    for each row
    execute procedure public.handle_updated_at();

-- Create RLS policies for profiles
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
    on public.profiles for update
    using ( auth.uid() = id );

-- Create RLS policies for agencies
create policy "Agencies are viewable by everyone."
    on public.agencies for select
    using ( true );

create policy "Only verified agents can create agencies."
    on public.agencies for insert
    with check (
        exists (
            select 1 from public.agents
            where agents.id = auth.uid()
            and agents.is_verified = true
        )
    );

-- Create RLS policies for agents
create policy "Agents are viewable by everyone."
    on public.agents for select
    using ( true );

create policy "Users can insert their own agent profile."
    on public.agents for insert
    with check ( auth.uid() = id );

create policy "Agents can update their own profile."
    on public.agents for update
    using ( auth.uid() = id );

-- Create RLS policies for properties
create policy "Properties are viewable by everyone."
    on public.properties for select
    using ( true );

create policy "Agents can create properties."
    on public.properties for insert
    with check (
        exists (
            select 1 from public.agents
            where agents.id = auth.uid()
        )
    );

create policy "Agents can update their own properties."
    on public.properties for update
    using ( auth.uid() = agent_id );

-- Create RLS policies for inquiries
create policy "Users can view their own inquiries."
    on public.inquiries for select
    using ( auth.uid() = user_id );

create policy "Agents can view inquiries for their properties."
    on public.inquiries for select
    using (
        exists (
            select 1 from public.properties
            where properties.id = inquiries.property_id
            and properties.agent_id = auth.uid()
        )
    );

create policy "Users can create inquiries."
    on public.inquiries for insert
    with check ( auth.uid() = user_id );

-- Create RLS policies for chat_messages
create policy "Users can view messages in their inquiries."
    on public.chat_messages for select
    using (
        exists (
            select 1 from public.inquiries
            where inquiries.id = chat_messages.inquiry_id
            and inquiries.user_id = auth.uid()
        )
    );

create policy "Agents can view messages for their properties."
    on public.chat_messages for select
    using (
        exists (
            select 1 from public.inquiries
            join public.properties on properties.id = inquiries.property_id
            where inquiries.id = chat_messages.inquiry_id
            and properties.agent_id = auth.uid()
        )
    );

create policy "Users can create messages in their inquiries."
    on public.chat_messages for insert
    with check (
        exists (
            select 1 from public.inquiries
            where inquiries.id = chat_messages.inquiry_id
            and inquiries.user_id = auth.uid()
        )
    );

-- Create RLS policies for property_inquiries
create policy "Users can view their own inquiries."
    on public.property_inquiries for select
    using ( auth.uid() = user_id );

create policy "Property owners can view inquiries for their properties."
    on public.property_inquiries for select
    using (
        exists (
            select 1 from public.properties
            where properties.id = property_inquiries.property_id
            and properties.agent_id = auth.uid()
        )
    );

create policy "Users can create inquiries."
    on public.property_inquiries for insert
    with check ( auth.uid() = user_id );

-- Create RLS policies for property_reviews
create policy "Reviews are viewable by everyone."
    on public.property_reviews for select
    using ( true );

create policy "Users can create reviews."
    on public.property_reviews for insert
    with check ( auth.uid() = user_id );

create policy "Users can update own reviews."
    on public.property_reviews for update
    using ( auth.uid() = user_id );

create policy "Users can delete own reviews."
    on public.property_reviews for delete
    using ( auth.uid() = user_id );

-- Create RLS policies for property_saved
create policy "Users can view their own saved."
    on public.property_saved for select
    using ( auth.uid() = user_id );

create policy "Users can create saved."
    on public.property_saved for insert
    with check ( auth.uid() = user_id );

create policy "Users can delete own saved."
    on public.property_saved for delete
    using ( auth.uid() = user_id );

-- Create RLS policies for property_views
create policy "Property owners can view analytics."
    on public.property_views for select
    using (
        exists (
            select 1 from public.properties
            where properties.id = property_views.property_id
            and properties.agent_id = auth.uid()
        )
    );

create policy "Anyone can create views."
    on public.property_views for insert
    with check ( true );

-- Grant necessary permissions
grant usage on schema public to authenticated;
grant usage on schema public to anon;

grant all on public.profiles to authenticated;
grant select on public.profiles to anon;

grant all on public.agencies to authenticated;
grant select on public.agencies to anon;

grant all on public.agents to authenticated;
grant select on public.agents to anon;

grant all on public.properties to authenticated;
grant select on public.properties to anon;

grant all on public.inquiries to authenticated;
grant select on public.inquiries to anon;

grant all on public.chat_messages to authenticated;
grant select on public.chat_messages to anon;

grant all on public.property_inquiries to authenticated;
grant select on public.property_inquiries to anon;

grant all on public.property_reviews to authenticated;
grant select on public.property_reviews to anon;

grant all on public.property_saved to authenticated;
grant select on public.property_saved to anon;

grant all on public.property_views to authenticated;
grant select on public.property_views to anon;

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
        full_name,
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
        coalesce(raw_metadata->>'fullName', ''),
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

-- Create trigger for new user creation
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user(); 