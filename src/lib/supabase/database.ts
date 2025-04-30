
import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';
import { v4 as uuidv4 } from 'uuid';

// Initialize the Supabase client with proper environment variables
// Default to the public demo keys if environment variables are not available
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ulegmjoxsjibkqdydetf.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsZWdtam94c2ppYmtxZHlkZXRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4MjIyNzYsImV4cCI6MjA2MTM5ODI3Nn0.3t9ps9TdTnlzK-zjhA2as4nfklJ9FlzGOb6_0trebHU';

// Log environment variable status
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.log('Using Supabase connection:', { 
    url: supabaseUrl, 
    keyAvailable: supabaseAnonKey ? 'Yes' : 'No'
  });
}

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
    
    // Specifically test the insert policy with a dummy profile
    console.log('Testing profile insert with anon key...');
    const testId = uuidv4();
    const { data: insertData, error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: testId,
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com'
      })
      .select('*');
    
    if (insertError) {
      console.log('Profiles insert policy check:', insertError);
      
      // Special handling for RLS policy violations
      if (insertError.message.includes('violates row-level security policy')) {
        console.log('RLS policies need to be updated in Supabase SQL editor. Proceeding with application.');
        
        // Print SQL to fix the issue
        console.log('To fix RLS policies, run the following SQL in your Supabase SQL editor:');
        console.log(`
CREATE POLICY "Users can insert their own profile" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Service role can insert any profile" 
ON profiles FOR INSERT 
WITH CHECK (auth.role() = 'service_role' OR auth.uid() = id);
      `);
        
        return false;
      }
    }
    
    // Clean up test data if it was created successfully
    if (insertData) {
      await supabase
        .from('profiles')
        .delete()
        .eq('id', testId);
    }
    
    return !insertError;
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
      console.log('✅ RLS policies appear to be configured correctly');
      return true;
    } else {
      console.warn('⚠️ RLS policies may not be configured correctly');
      return false;
    }
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
