// src/database.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Use either the service role key (preferred for backend) or anon key as fallback
const supabaseUrl = process.env.SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY;

console.log('Initializing Supabase with URL:', supabaseUrl ? 'URL is set' : 'URL is missing');
console.log('API Key status:', supabaseKey ? 'Key is set' : 'Key is missing');

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Test database connection
async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Database connection test failed:', error);
    } else {
      console.log('Database connection test successful');
    }
  } catch (err) {
    console.error('Database connection test error:', err);
  }
}

testConnection();

module.exports = supabase;
