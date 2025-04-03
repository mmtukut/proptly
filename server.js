const express = require('express');
const path = require('path');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Debug environment variables
console.log('Environment Check:', {
    supabaseUrl: process.env.REACT_APP_SUPABASE_URL ? 'Present' : 'Missing',
    supabaseKey: process.env.REACT_APP_SUPABASE_ANON_KEY ? 'Present' : 'Missing',
    nodeEnv: process.env.NODE_ENV,
    port: PORT
});

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// Initialize Supabase with error handling
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test Supabase connection
const testSupabaseConnection = async () => {
    try {
        const { data, error } = await supabase.from('profiles').select('count').single();
        if (error) throw error;
        console.log('Supabase connection successful');
    } catch (error) {
        console.error('Supabase connection error:', error.message);
    }
};

testSupabaseConnection();

// API Routes with error handling
app.get('/api/properties', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('properties')
            .select('*');
        
        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error('Error fetching properties:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/profiles', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*');
        
        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error('Error fetching profiles:', error);
        res.status(500).json({ error: error.message });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
}); 