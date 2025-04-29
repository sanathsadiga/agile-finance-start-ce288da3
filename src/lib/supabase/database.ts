
import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';
import { v4 as uuidv4 } from 'uuid';

// Initialize the Supabase client with proper environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Using fallback values.');
}

// Log environment variable status
console.log('Initializing Supabase with:', { 
  url: supabaseUrl ? 'URL defined' : 'URL missing', 
  key: supabaseAnonKey ? 'Key defined' : 'Key missing' 
});

// Create the Supabase client with proper TypeScript types
export const supabase = createClient<Database>(
  supabaseUrl || 'https://ulegmjoxsjibkqdydetf.supabase.co', 
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsZWdtam94c2ppYmtxZHlkZXRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4MjIyNzYsImV4cCI6MjA2MTM5ODI3Nn0.3t9ps9TdTnlzK-zjhA2as4nfklJ9FlzGOb6_0trebHU',
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

// Helper function to check Row Level Security policies
const checkRLSPolicies = async () => {
  try {
    console.log('Checking RLS policies for profiles table...');
    
    // Check profiles table RLS policy
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
      
    console.log('Profiles RLS check result:', 
      profilesError ? `Error: ${profilesError.message}` : 'Success',
      'Data:', profilesData
    );
    
    // Check if the insert policy works for profiles
    const testId = uuidv4(); // Use proper UUID format
    const testEmail = `test-${Date.now()}@example.com`;
    
    // Try inserting with anon key
    console.log('Testing profile insert with anon key...');
    const { error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: testId,
        email: testEmail,
        first_name: 'Test',
        last_name: 'User',
      })
      .select();
      
    console.log('Profiles insert policy check:', 
      insertError ? `Error: ${insertError.message}` : 'Success'
    );
    
    if (!insertError) {
      // Clean up test user
      await supabase.from('profiles').delete().eq('id', testId);
      console.log('Test profile cleaned up successfully');
      return true;
    } else {
      // Try a different approach to determine if it's an RLS issue
      console.log('Checking if RLS policies are configured correctly for INSERT...');
      return false;
    }
    
  } catch (err) {
    console.error('Error checking RLS policies:', err);
    return false;
  }
};

// Helper function to initialize the database schema and apply necessary changes
export const initializeDatabase = async () => {
  console.log('Checking database schema and RLS policies...');
  
  try {
    // Check RLS policies
    const rlsPoliciesWork = await checkRLSPolicies();
    
    if (rlsPoliciesWork) {
      console.log('✅ RLS policies are configured correctly');
    } else {
      console.warn('⚠️ RLS policies may not be configured correctly');
      console.log('You may need to run the following SQL commands in your Supabase SQL editor:');
      console.log(`
CREATE POLICY "Users can insert their own profile" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Service role can insert any profile" 
ON profiles FOR INSERT 
WITH CHECK (auth.role() = 'service_role' OR auth.uid() = id);
      `);
    }
    
    return true;
  } catch (err) {
    console.error('Error during database initialization:', err);
    return false;
  }
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
