-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    account_type TEXT NOT NULL DEFAULT 'user',
    role TEXT NOT NULL DEFAULT 'user',
    address TEXT,
    city TEXT,
    state TEXT,
    country TEXT,
    bio TEXT,
    website TEXT,
    avatar_url TEXT,
    languages TEXT[],
    specializations TEXT[],
    saved_properties UUID[],
    search_history JSONB[],
    preferences JSONB DEFAULT '{"notifications": true, "newsletter": true}'::jsonb,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL NOT NULL,
    type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending_verification',
    location TEXT NOT NULL,
    coordinates POINT,
    bedrooms INTEGER,
    bathrooms INTEGER,
    size DECIMAL,
    features TEXT[],
    images TEXT[],
    agency_id UUID REFERENCES profiles(id),
    verified_at TIMESTAMPTZ,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create verification_requests table
CREATE TABLE IF NOT EXISTS verification_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id),
    agent_id UUID REFERENCES profiles(id),
    admin_id UUID REFERENCES profiles(id),
    status TEXT NOT NULL DEFAULT 'pending',
    notes TEXT,
    documents JSONB,
    submission_date TIMESTAMPTZ DEFAULT NOW(),
    verification_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_requests ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Properties policies
CREATE POLICY "Properties are viewable by everyone" ON properties
    FOR SELECT USING (status = 'verified');

CREATE POLICY "Agents can insert properties" ON properties
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND (role = 'agent' OR account_type = 'agent')
        )
    );

CREATE POLICY "Agents can update own properties" ON properties
    FOR UPDATE USING (
        agency_id = auth.uid()
        AND EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND (role = 'agent' OR account_type = 'agent')
        )
    );

CREATE POLICY "Admins can update any property" ON properties
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

-- Verification requests policies
CREATE POLICY "Agents can view own verification requests" ON verification_requests
    FOR SELECT USING (agent_id = auth.uid());

CREATE POLICY "Admins can view all verification requests" ON verification_requests
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

-- Functions
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, account_type, role)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'accountType', 'user'),
        CASE 
            WHEN new.email = 'admin@fastfind360.com' THEN 'admin'
            WHEN COALESCE(new.raw_user_meta_data->>'accountType', 'user') = 'agent' THEN 'agent'
            ELSE 'user'
        END
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();
