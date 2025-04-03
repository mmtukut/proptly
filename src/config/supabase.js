import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Singleton instance
let supabaseInstance = null;

// Get Supabase instance
const getSupabase = () => {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storageKey: 'fastfind360_auth',
      storage: window.localStorage
    },
    db: {
      schema: 'public'
    },
    global: {
      headers: {
        'Content-Type': 'application/json'
      }
    },
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  });

  return supabaseInstance;
};

// Export the singleton instance
export const supabase = getSupabase();

// Test connection function
export const testConnection = async () => {
  try {
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError) throw authError;
    
    const { data, error: dbError } = await supabase
      .from('profiles')
      .select('count')
      .single();
    if (dbError) throw dbError;

    console.log('Supabase connection successful');
    return true;
  } catch (error) {
    console.error('Supabase connection error:', error.message);
    return false;
  }
};

// Initialize connection test
testConnection();

// Enhanced error logging
const logError = (error, context) => {
  console.error(`Supabase ${context} Error:`, {
    message: error.message,
    details: error.details,
    hint: error.hint,
    code: error.code
  });
};

// Set up auth state change listener with error handling
supabase.auth.onAuthStateChange((event, session) => {
  try {
    if (event === 'SIGNED_IN') {
      console.log('Successfully connected to Supabase');
    }
  } catch (error) {
    logError(error, 'Auth State Change');
  }
});

// Helper function to get user role
export const getUserRole = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data?.role || 'user';
  } catch (error) {
    console.error('Error fetching user role:', error);
    return 'user';
  }
};

// Analytics placeholder (to be implemented with a different service if needed)
const analytics = null;

// Performance monitoring placeholder
const performance = null;

// Export the Supabase client and other utilities
export { analytics, performance };
export default supabase;
