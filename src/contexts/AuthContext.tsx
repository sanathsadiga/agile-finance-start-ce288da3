
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase/database";
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

// Define user type
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  companyName?: string;
}

// Define context type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: Omit<User, 'id'> & { password: string }) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
  isAuthenticated: false,
});

// Create a hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Helper function to map Supabase user to our User interface
const mapSupabaseUser = async (supabaseUser: SupabaseUser): Promise<User | null> => {
  try {
    console.log('Fetching profile data for user:', supabaseUser.id);
    
    // Get user profile from the profiles table
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', supabaseUser.id)
      .single();

    if (error) {
      console.log('Profile data fetch result:', { data, error });
      console.error('Error fetching profile:', error);
      
      // Try to create a profile using user metadata if profile doesn't exist
      const metadata = supabaseUser.user_metadata;
      if (metadata && metadata.first_name && metadata.last_name) {
        return {
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          firstName: metadata.first_name,
          lastName: metadata.last_name,
          companyName: metadata.company_name,
        };
      }
      return null;
    }

    if (!data) {
      console.log('No profile found for user:', supabaseUser.id);
      return null;
    }

    return {
      id: data.id,
      email: data.email,
      firstName: data.first_name,
      lastName: data.last_name,
      companyName: data.company_name || undefined,
    };
  } catch (err) {
    console.error('Error in mapSupabaseUser:', err);
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check for existing session and set up auth change listener
  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log('Checking for existing session...');
        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          throw error;
        }

        if (session) {
          console.log('Session found:', session);
          const mappedUser = await mapSupabaseUser(session.user);
          if (mappedUser) {
            console.log('Mapped user from session:', mappedUser);
            setUser(mappedUser);
          } else {
            console.warn('Could not map user from session');
          }
        } else {
          console.log('No session found');
        }
      } catch (error) {
        console.error('Error checking auth session:', error);
      } finally {
        setLoading(false);
      }
    };

    // Call it immediately
    checkSession();

    // Set up listener for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        if (session?.user) {
          // Always try to get the profile, even on SIGNED_UP events
          const mappedUser = await mapSupabaseUser(session.user);
          if (mappedUser) {
            setUser(mappedUser);
          } else {
            console.warn('Could not map user from auth change');
            
            // Attempt to create profile from metadata as fallback
            if (session.user.user_metadata) {
              try {
                const { error: profileError } = await supabase
                  .from('profiles')
                  .insert({
                    id: session.user.id,
                    email: session.user.email,
                    first_name: session.user.user_metadata.first_name || '',
                    last_name: session.user.user_metadata.last_name || '',
                    company_name: session.user.user_metadata.company_name || null,
                  });
                
                if (!profileError) {
                  // Try to get user info again
                  const newMappedUser = await mapSupabaseUser(session.user);
                  if (newMappedUser) {
                    setUser(newMappedUser);
                  }
                }
              } catch (err) {
                console.error('Error creating profile from auth change:', err);
              }
            }
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    // Clean up subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Login with Supabase
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log('Attempting login with email:', email);
      // Basic validation
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('Login response:', data, 'error:', error);

      if (error) {
        throw error;
      }

      if (!data.user) {
        throw new Error('No user returned from authentication');
      }

      // Check if profile exists
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError && profileError.code === 'PGRST116') { // Record not found
        // Create profile if it doesn't exist
        const metadata = data.user.user_metadata;
        const newProfile = {
          id: data.user.id,
          email: data.user.email || '',
          first_name: metadata?.first_name || '',
          last_name: metadata?.last_name || '',
          company_name: metadata?.company_name || null,
        };
        
        await supabase
          .from('profiles')
          .insert(newProfile);
      }
      
      // Map the user
      const mappedUser = await mapSupabaseUser(data.user);
      if (!mappedUser) {
        throw new Error('Could not retrieve user profile');
      }
      
      setUser(mappedUser);
      
      // Show success message
      toast({
        title: "Login successful",
        description: `Welcome back, ${mappedUser.firstName}!`,
      });
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: error?.message || "An unknown error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Signup with Supabase
  const signup = async (userData: Omit<User, 'id'> & { password: string }) => {
    setLoading(true);
    try {
      console.log('Attempting signup with:', userData);
      // Basic validation
      if (!userData.email || !userData.password) {
        throw new Error('Email and password are required');
      }
      
      if (userData.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Sign up with Supabase - store user metadata during signup
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            company_name: userData.companyName || null,
            email: userData.email
          }
        }
      });

      console.log('Signup response:', data, 'error:', error);

      if (error) {
        throw error;
      }

      if (!data.user) {
        throw new Error('No user returned from registration');
      }
      
      // Create a profile in the profiles table
      console.log('Creating user profile with ID:', data.user.id);
      
      try {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: userData.email,
            first_name: userData.firstName,
            last_name: userData.lastName,
            company_name: userData.companyName || null,
          });
          
        if (profileError) {
          console.error('Error creating profile:', profileError);
          console.log('Attempting direct insert as authenticated user...');
          
          // Try to authenticate first and then insert
          if (data.session) {
            // We already have a session, use it
            const { error: directInsertError } = await supabase
              .from('profiles')
              .insert({
                id: data.user.id,
                email: userData.email,
                first_name: userData.firstName,
                last_name: userData.lastName,
                company_name: userData.companyName || null,
              });
            
            if (directInsertError) {
              console.error('Direct insert failed:', directInsertError.message);
            }
          } else {
            // We don't have a session, let's just create the user object without a profile
            console.warn('Could not create profile, proceeding without it');
          }
        }
      } catch (profileInsertErr) {
        console.error('Profile insert exception:', profileInsertErr);
      }
      
      // Create the mapped user regardless of profile creation
      const newUser: User = {
        id: data.user.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        companyName: userData.companyName,
      };
      
      setUser(newUser);
      
      toast({
        title: "Signup successful",
        description: `Welcome to FinanceFlow, ${newUser.firstName}!`,
      });
      
      // Navigate to dashboard
      navigate('/dashboard');
      
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: "Signup failed",
        description: error?.message || "An unknown error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout with Supabase
  const logout = async () => {
    try {
      console.log('Attempting to log out');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        throw error;
      }
      
      setUser(null);
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      
      navigate('/');
    } catch (error: any) {
      console.error('Error during logout:', error);
      toast({
        title: "Logout failed",
        description: error?.message || "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  // Prepare the value object
  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
