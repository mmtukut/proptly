-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('user', 'ai')),
    property_id UUID REFERENCES properties(id),
    user_id TEXT,
    sentiment JSONB,
    entities JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
); 