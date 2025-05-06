import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/database';
import { useNavigate, useLocation } from 'react-router-dom';

interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: any }>;
  signup: (email: string, password: string, username?: string) => Promise<{ error: any, user: any }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.info('Checking for existing session...');
    
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error checking session:', error);
        setLoading(false);
        return;
      }
      
      if (session) {
        console.info('Session found, user is authenticated');
        setUser(session.user);
        setIsAuthenticated(true);
        
        // Auto-navigate to dashboard if on login page and already authenticated
        if (location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/') {
          navigate('/dashboard', { replace: true });
        }
      } else {
        console.info('No active session');
      }
      
      setLoading(false);
    };
    
    checkSession();
    
    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.info('Auth state changed:', event);
      if (event === 'SIGNED_IN' && session) {
        setUser(session.user);
        setIsAuthenticated(true);
        
        // Redirect to dashboard on successful sign in
        navigate('/dashboard', { replace: true });
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAuthenticated(false);
        navigate('/login');
      }
    });
    
    // Cleanup subscription
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);
  
  // Authentication functions
  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error('Login error:', error);
        return { error };
      }
      
      console.info('Login successful');
      setUser(data.user);
      setIsAuthenticated(true);
      
      // Redirect to dashboard immediately
      navigate('/dashboard', { replace: true });
      
      return { error: null };
    } catch (error) {
      console.error('Unexpected login error:', error);
      return { error };
    }
  };
  
  const signup = async (email: string, password: string, username?: string) => {
    try {
      const { data: { user }, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            username: username,
          }
        }
      });
  
      if (error) {
        console.error('Signup error:', error);
        return { error, user: null };
      }
  
      console.info('Signup successful');
      setUser(user);
      setIsAuthenticated(true);
      navigate('/dashboard', { replace: true });
      return { error: null, user: user };
    } catch (error) {
      console.error('Unexpected signup error:', error);
      return { error, user: null };
    }
  };
  
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
  
      if (error) {
        console.error('Logout error:', error);
        return;
      }
  
      console.info('Logout successful');
      setUser(null);
      setIsAuthenticated(false);
      navigate('/login');
    } catch (error) {
      console.error('Unexpected logout error:', error);
    }
  };
  
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });
  
      if (error) {
        console.error('Reset password error:', error);
        return { error };
      }
  
      console.info('Reset password email sent successfully');
      return { error: null };
    } catch (error) {
      console.error('Unexpected reset password error:', error);
      return { error };
    }
  };
  
  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      loading,
      login,
      signup,
      logout,
      resetPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
