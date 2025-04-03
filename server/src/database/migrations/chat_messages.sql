-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'user', -- 'user' or 'ai'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    conversation_id UUID,
    property_id UUID REFERENCES properties(id),
    metadata JSONB DEFAULT '{}'::jsonb
);
