
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
const mapSupabaseUser = async (supabaseUser: SupabaseUser): Promise<User> => {
  // Get user profile from the profiles table
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', supabaseUser.id)
    .single();

  console.log('Profile data:', data, 'error:', error);

  if (error || !data) {
    // If no profile exists, return a default user object
    console.log('No profile found, using default user object');
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      firstName: 'New',
      lastName: 'User',
    };
  }

  return {
    id: data.id,
    email: data.email,
    firstName: data.first_name,
    lastName: data.last_name,
    companyName: data.company_name || undefined,
  };
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
          console.log('Mapped user:', mappedUser);
          setUser(mappedUser);
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
        if (event === 'SIGNED_IN' && session) {
          const mappedUser = await mapSupabaseUser(session.user);
          setUser(mappedUser);
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

      // Map the user
      const mappedUser = await mapSupabaseUser(data.user);
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
      console.log('Attempting signup with email:', userData.email);
      // Basic validation
      if (!userData.email || !userData.password) {
        throw new Error('Email and password are required');
      }
      
      if (userData.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });

      console.log('Signup response:', data, 'error:', error);

      if (error) {
        throw error;
      }

      if (!data.user) {
        throw new Error('No user returned from registration');
      }

      // Create a profile in the profiles table - using the auth user's id
      console.log('Creating user profile with ID:', data.user.id);
      
      // IMPORTANT: We need to use the service role client OR modify RLS policies
      // For simplicity, we'll use RLS bypass by making the insert as the authenticated user
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email: userData.email,
          first_name: userData.firstName,
          last_name: userData.lastName,
          company_name: userData.companyName || null,
        });

      console.log('Profile creation result:', profileError ? `Error: ${profileError.message}` : 'Success');

      if (profileError) {
        console.error('Error creating profile:', profileError);
        // Don't delete the user as before - just show error and continue
        toast({
          title: "Profile creation issue",
          description: "Account created but profile setup had an issue. Please update your profile later.",
          variant: "destructive",
        });
      }

      // Create the mapped user
      const newUser: User = {
        id: data.user.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        companyName: userData.companyName,
      };
      
      setUser(newUser);
      
      // Show success message
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
