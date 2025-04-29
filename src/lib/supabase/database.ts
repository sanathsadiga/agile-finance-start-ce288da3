
import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Initialize the Supabase client with proper environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ulegmjoxsjibkqdydetf.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsZWdtam94c2ppYmtxZHlkZXRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4MjIyNzYsImV4cCI6MjA2MTM5ODI3Nn0.3t9ps9TdTnlzK-zjhA2as4nfklJ9FlzGOb6_0trebHU';

console.log('Initializing Supabase with:', { 
  url: supabaseUrl ? 'URL defined' : 'URL missing', 
  key: supabaseAnonKey ? 'Key defined' : 'Key missing' 
});

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

// Helper function to initialize the database schema and apply necessary changes
export const initializeDatabase = async () => {
  console.log('Checking database schema and RLS policies...');
  
  // Check if the profiles RLS policy allows new signups to create their own profile
  try {
    const { data: policies, error } = await supabase.rpc('get_policies');
    
    if (error) {
      console.error('Error checking RLS policies:', error.message);
    } else {
      console.log('Current RLS policies:', policies);
    }
    
    // This is just informational - actual policy changes should be done in the Supabase dashboard
  } catch (err) {
    console.error('Error during database initialization:', err);
  }
  
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
