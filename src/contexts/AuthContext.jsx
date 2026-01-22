import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, TABLES } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(false)

  // Profile operations
  const profileOperations = {
    clear() {
      setUserProfile(null)
      setProfileLoading(false)
    }
  }

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user);

        // Fetch user profile
        try {
          const { data: profileData, error: profileError } = await supabase
            .from(TABLES.USER_PROFILES)
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileData && !profileError) {
            setUserProfile(profileData);
            localStorage.setItem('userProfile', JSON.stringify(profileData));
          }
        } catch (profileError) {
          console.error('Error fetching user profile:', profileError);
        }
      }

      setLoading(false);
    };

    getInitialSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);

          // Fetch user profile
          try {
            const { data: profileData, error: profileError } = await supabase
              .from(TABLES.USER_PROFILES)
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profileData && !profileError) {
              setUserProfile(profileData);
              localStorage.setItem('userProfile', JSON.stringify(profileData));
            }
          } catch (profileError) {
            console.error('Error fetching user profile:', profileError);
          }
        } else {
          setUser(null);
          setUserProfile(null);
          localStorage.removeItem('userProfile');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [])

  // Auth methods
  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { data: null, error };
      }

      // Check if email is verified
      if (data.user && !data.user.email_confirmed_at) {
        // Sign out the user since email is not verified
        await supabase.auth.signOut();
        return {
          data: null,
          error: { message: 'Email not verified. Please verify your email first.' }
        };
      }

      // User profile will be fetched automatically by the auth state change listener
      return { data, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { data: null, error: { message: error.message || 'Network error. Please try again.' } };
    }
  }

  const signUp = async (email, password, full_name, role = 'user') => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name,
            role,
          },
        },
      });

      if (error) {
        return { data: null, error };
      }

      // Create user profile in the database
      if (data.user) {
        try {
          const { error: profileError } = await supabase
            .from(TABLES.USER_PROFILES)
            .insert([
              {
                id: data.user.id,
                email: data.user.email,
                full_name,
                role,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
            ]);

          if (profileError) {
            console.error('Error creating user profile:', profileError);
            // Don't fail signup if profile creation fails
          }
        } catch (profileError) {
          console.error('Error creating user profile:', profileError);
          // Don't fail signup if profile creation fails
        }
      }

      return { data, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { data: null, error: { message: error.message || 'Network error. Please try again.' } };
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
      }
      localStorage.removeItem('userProfile');
      setUser(null);
      setUserProfile(null);
      return { error };
    } catch (error) {
      console.error('Sign out error:', error);
      // Even if logout fails on server, clear local state
      localStorage.removeItem('userProfile');
      setUser(null);
      setUserProfile(null);
      return { error: null };
    }
  }

  const updateProfile = async (updates) => {
    if (!user) return { error: { message: 'No user logged in' } }

    try {
      // For now, we'll update local state
      // This can be expanded to call a profile update endpoint
      const updatedProfile = { ...userProfile, ...updates };
      setUserProfile(updatedProfile);
      return { data: updatedProfile, error: null };
    } catch (error) {
      return { data: null, error: { message: error.message || 'Network error. Please try again.' } };
    }
  }

  const value = {
    user,
    userProfile,
    loading,
    profileLoading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}