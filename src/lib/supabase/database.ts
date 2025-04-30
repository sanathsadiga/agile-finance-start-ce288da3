
import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Initialize the Supabase client with proper environment variables
const supabaseUrl = 'https://ulegmjoxsjibkqdydetf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsZWdtam94c2ppYmtxZHlkZXRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4MjIyNzYsImV4cCI6MjA2MTM5ODI3Nn0.3t9ps9TdTnlzK-zjhA2as4nfklJ9FlzGOb6_0trebHU';

console.log('Using Supabase connection:', { 
  url: supabaseUrl, 
  keyAvailable: supabaseAnonKey ? 'Yes' : 'No'
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

// Initialize database (simplified version focused on connection check)
export const initializeDatabase = async () => {
  try {
    const isConnected = await checkSupabaseConnection();
    
    if (isConnected) {
      console.log('✅ Supabase connection successful! Database ready for authentication.');
      return true;
    } else {
      console.warn('⚠️ Supabase connection failed. Authentication may not work properly.');
      return false;
    }
  } catch (err) {
    console.error('Error during database initialization:', err);
    return false;
  }
};
