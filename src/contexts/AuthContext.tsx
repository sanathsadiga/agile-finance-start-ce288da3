import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase/database";
import { User as SupabaseUser } from '@supabase/supabase-js';

// Define user type
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  // Add any additional fields that might be useful from the profile
}

// Define context type
interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: Omit<User, 'id'> & { password: string }) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  loading: true,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
  isAuthenticated: false,
});

// Create a hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Helper function to get user profile
const getUserProfile = async (userId: string): Promise<User | null> => {
  try {
    console.log('Fetching profile data for user:', userId);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    if (!data) {
      console.log('No profile found for user:', userId);
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
    console.error('Error in getUserProfile:', err);
    return null;
  }
};

// Helper function to create or update user profile
const createOrUpdateProfile = async (
  userId: string, 
  email: string,
  firstName: string,
  lastName: string,
  companyName?: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        email: email,
        first_name: firstName,
        last_name: lastName,
        company_name: companyName || null,
      });
    
    if (error) {
      console.error('Error creating/updating profile:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Error in createOrUpdateProfile:', err);
    return false;
  }
};

// Create user object from metadata
const createUserFromMetadata = (
  userId: string,
  email: string,
  metadata: any
): User => {
  return {
    id: userId,
    email: email,
    firstName: metadata?.first_name || '',
    lastName: metadata?.last_name || '',
    companyName: metadata?.company_name,
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
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          setLoading(false);
          return;
        }

        if (session?.user) {
          console.log('Session found, user ID:', session.user.id);
          
          // Try to get user profile
          const profile = await getUserProfile(session.user.id);
          
          if (profile) {
            console.log('User profile found:', profile);
            setUser(profile);
          } else {
            // Create user from metadata as fallback
            console.log('No profile found, creating from metadata');
            const metadata = session.user.user_metadata;
            const newUser = createUserFromMetadata(
              session.user.id, 
              session.user.email || '', 
              metadata
            );
            
            setUser(newUser);
            
            // Try to create profile in background
            await createOrUpdateProfile(
              session.user.id,
              session.user.email || '',
              metadata?.first_name || '',
              metadata?.last_name || '',
              metadata?.company_name
            );
          }
        } else {
          console.log('No active session');
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    // Call it immediately
    checkSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (event === 'SIGNED_OUT') {
          setUser(null);
          return;
        }
        
        if (!session?.user) {
          return;
        }
        
        // Try to get user profile after sign in or sign up
        const profile = await getUserProfile(session.user.id);
        
        if (profile) {
          setUser(profile);
        } else {
          // Create user from metadata if no profile found
          const metadata = session.user.user_metadata;
          const newUser = createUserFromMetadata(
            session.user.id, 
            session.user.email || '', 
            metadata
          );
          
          setUser(newUser);
          
          // Try to create profile in background
          await createOrUpdateProfile(
            session.user.id,
            session.user.email || '',
            metadata?.first_name || '',
            metadata?.last_name || '',
            metadata?.company_name
          );
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
      
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (!data.user) {
        throw new Error('No user returned from authentication');
      }

      // Profile will be loaded by the auth state change listener
      
      toast({
        title: "Login successful",
        description: `Welcome back!`,
      });
      
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
      console.log('Attempting signup with:', userData.email);
      
      if (!userData.email || !userData.password || !userData.firstName || !userData.lastName) {
        throw new Error('Email, password, first name and last name are required');
      }
      
      if (userData.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Sign up with Supabase
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

      if (error) {
        throw error;
      }

      if (!data.user) {
        throw new Error('No user returned from registration');
      }
      
      // Create a temporary user object immediately for better UX
      const newUser: User = {
        id: data.user.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        companyName: userData.companyName,
      };
      
      setUser(newUser);
      
      // Profile creation is now handled by the database trigger
      // but we still try to create it here as a fallback
      const profileCreated = await createOrUpdateProfile(
        data.user.id,
        userData.email,
        userData.firstName,
        userData.lastName,
        userData.companyName
      );
      
      console.log('Profile creation attempt result:', profileCreated ? 'Success' : 'Failed');
      
      toast({
        title: "Signup successful",
        description: `Welcome to FinanceFlow, ${userData.firstName}!`,
      });
      
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
      const { error } = await supabase.auth.signOut();
      
      if (error) {
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
    setUser,
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
