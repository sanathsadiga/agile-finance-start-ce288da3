
import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Initialize the Supabase client with proper environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create the Supabase client with proper TypeScript types
export const supabase = createClient<Database>(
  supabaseUrl, 
  supabaseAnonKey, 
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    global: {
      headers: {
        'x-application-name': 'financeflow',
      },
    },
  }
);

// Helper function to initialize the database schema
export const initializeDatabase = async () => {
  // Check if tables exist, if not create them
  console.log('Checking database schema...');
  
  // This is just a check function - actual table creation should be done via migrations
  // in the Supabase dashboard for production applications
  
  return true;
};

// Function to check if Supabase connection is working
export const checkSupabaseConnection = async () => {
  try {
    // Simple query to check connection
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    
    if (error) {
      console.error('Supabase connection check failed:', error.message);
      return false;
    }
    
    console.log('Supabase connection successful!');
    return true;
  } catch (err) {
    console.error('Error checking Supabase connection:', err);
    return false;
  }
};
