-- Drop existing table if it exists
DROP TABLE IF EXISTS properties;

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create properties table with UUID
CREATE TABLE IF NOT EXISTS properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id TEXT,
    title TEXT NOT NULL,
    description TEXT,
    price BIGINT NOT NULL,
    location TEXT NOT NULL,
    address TEXT NOT NULL DEFAULT '',
    type TEXT,
    status TEXT DEFAULT 'Available',
    bedrooms INTEGER,
    bathrooms INTEGER,
    area TEXT,
    images JSONB DEFAULT '[]'::jsonb,
    amenities JSONB DEFAULT '[]'::jsonb,
    coordinates JSONB DEFAULT '[]'::jsonb,
    date_available DATE,
    image TEXT,
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
); 