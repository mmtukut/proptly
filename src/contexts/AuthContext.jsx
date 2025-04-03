import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { supabaseServer } from '../config/supabaseServer';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      try {
        // Get initial session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          return;
        }

        if (mounted) {
          if (session?.user) {
            setCurrentUser(session.user);
            const { data: profileData } = await supabase
              .from('profiles')
              .select('role, account_type')
              .eq('id', session.user.id)
              .single();
            
            setUserRole(profileData?.role || profileData?.account_type || 'user');
          }
          setLoading(false);
          setInitialized(true);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setLoading(false);
          setInitialized(true);
        }
      }
    }

    initializeAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (mounted) {
        if (session?.user) {
          setCurrentUser(session.user);
          try {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('role, account_type')
              .eq('id', session.user.id)
              .single();
            
            setUserRole(profileData?.role || profileData?.account_type || 'user');
          } catch (error) {
            console.error('Error fetching user role:', error);
          }
        } else {
          setCurrentUser(null);
          setUserRole(null);
        }
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // Sign Up
  async function signup(email, password, additionalData) {
    try {
      // Convert to string and validate inputs
      email = String(email || '');
      password = String(password || '');

      // Check for empty values after conversion
      if (!email.trim() || !password.trim()) {
        throw new Error('Email and password are required');
      }

      // Trim the values
      email = email.trim();
      password = password.trim();

      console.log('Starting signup process...', { email, hasAdditionalData: !!additionalData });

      // First, check if user exists using server client
      const { data: existingUser, error: checkError } = await supabaseServer
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking existing user:', checkError);
        throw new Error('Error checking user existence');
      }

      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Sign up the user using server client
      const { data, error: signUpError } = await supabaseServer.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Auto-confirm email for testing
        user_metadata: {
          email,
          phone: additionalData?.phone || '',
          accountType: additionalData?.accountType || 'personal'
        }
      });

      if (signUpError) {
        console.error('Detailed signup error:', signUpError);
        console.error('Error details:', {
          status: signUpError.status,
          name: signUpError.name,
          message: signUpError.message,
          stack: signUpError.stack
        });
        throw signUpError;
      }

      if (!data?.user) {
        console.error('No user data returned from signup');
        throw new Error('No user data returned from signup');
      }

      // Create profile using server client
      const profileData = {
        id: data.user.id,
        email: email,
        phone: additionalData?.phone || null,
        account_type: additionalData?.accountType || 'personal',
        role: additionalData?.accountType === 'agent' ? 'agent' : 'user',
        full_name: additionalData?.fullName || null,
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        email_verified: true,
        saved_properties: [],
        search_history: [],
        preferences: {
          notifications: true,
          newsletter: true
        }
      };

      // First, check if profile already exists
      const { data: existingProfile } = await supabaseServer
        .from('profiles')
        .select('id')
        .eq('id', data.user.id)
        .single();

      // If profile doesn't exist, create it
      if (!existingProfile) {
        const { error: profileError } = await supabaseServer
          .from('profiles')
          .insert([profileData])
          .select()
          .single();

        if (profileError) {
          console.error('Detailed profile creation error:', profileError);
          console.log('Attempted profile data:', profileData);
          
          // Try to create profile again after a short delay
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          const { error: retryError } = await supabaseServer
            .from('profiles')
            .insert([profileData])
            .select()
            .single();
            
          if (retryError) {
            console.error('Profile creation retry failed:', retryError);
            toast.error('Profile setup incomplete. Please update your profile later.');
          } else {
            console.log('Profile created successfully on retry');
          }
        } else {
          console.log('Profile created successfully');
        }
      }

      // Sign in the user with the client
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        console.error('Error signing in after signup:', signInError);
        toast.error('Account created but could not sign in automatically');
      }

      toast.success('Account created successfully!');
      return { user: data.user };
    } catch (error) {
      console.error('Detailed signup process error:', error);
      toast.error(error.message || 'Failed to create account');
      throw error;
    }
  }

  // Login function
  async function login(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      });

      if (error) throw error;

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role, account_type, email_verified')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        throw new Error('Error fetching user profile');
      }

      setCurrentUser(data.user);
      setUserRole(profileData.role || profileData.account_type || 'user');

      return { user: data.user, profile: profileData };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Logout function
  async function logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setCurrentUser(null);
      setUserRole(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  // Google Sign In
  async function googleLogin() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: process.env.REACT_APP_REDIRECT_URL,        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Google login error:', error);
      toast.error(error.message);
      throw error;
    }
  }

  // Reset Password
  async function resetPassword(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`
      });
      
      if (error) throw error;
      toast.success('Password reset email sent!');
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error(error.message);
      throw error;
    }
  }

  // Update Password
  async function updatePassword(newPassword) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
      toast.success('Password updated successfully!');
    } catch (error) {
      console.error('Password update error:', error);
      toast.error(error.message);
      throw error;
    }
  }

  const value = {
    currentUser,
    userRole,
    signup,
    login,
    googleLogin,
    logout,
    resetPassword,
    updatePassword,
    loading,
    initialized
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}