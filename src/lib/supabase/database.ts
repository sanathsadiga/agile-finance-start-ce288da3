
import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Initialize the Supabase client with proper environment variables
const supabaseUrl = 'https://ulegmjoxsjibkqdydetf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsZWdtam94c2ppYmtxZHlkZXRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4MjIyNzYsImV4cCI6MjA2MTM5ODI3Nn0.3t9ps9TdTnlzK-zjhA2as4nfklJ9FlzGOb6_0trebHU';

console.log('[DATABASE] Initializing Supabase connection:', { 
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
    db: {
      schema: 'public',
    },
  }
);

// Enhanced function to check if Supabase connection is working
export const checkSupabaseConnection = async () => {
  try {
    // Simple query to check connection
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    
    if (error) {
      console.error('[DATABASE] Supabase connection check failed:', error.message);
      return false;
    }
    
    console.log('[DATABASE] Supabase connection successful!');
    return true;
  } catch (err) {
    console.error('[DATABASE] Error checking Supabase connection:', err);
    return false;
  }
};

// Initialize database with enhanced logging
export const initializeDatabase = async () => {
  try {
    console.log('[DATABASE] Initializing database and checking connection...');
    const isConnected = await checkSupabaseConnection();
    
    if (isConnected) {
      console.log('[DATABASE] ✅ Supabase connection successful! Database ready for authentication.');
      
      // Check if tables exist
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);
        
      if (profilesError) {
        console.error('[DATABASE] Error checking profiles table:', profilesError.message);
      } else {
        console.log('[DATABASE] Profiles table check successful');
      }
      
      // Check invoice_settings table
      const { data: invoiceData, error: invoiceError } = await supabase
        .from('invoice_settings')
        .select('count')
        .limit(1);
        
      if (invoiceError) {
        console.error('[DATABASE] Error checking invoice_settings table:', invoiceError.message);
        console.log('[DATABASE] Invoice settings table may need to be created. Check SQL setup.');
      } else {
        console.log('[DATABASE] Invoice settings table check successful');
      }
      
      // Check tax_settings table
      const { data: taxData, error: taxError } = await supabase
        .from('tax_settings')
        .select('count')
        .limit(1);
        
      if (taxError) {
        console.error('[DATABASE] Error checking tax_settings table:', taxError.message);
        console.log('[DATABASE] Tax settings table may need to be created. Check SQL setup.');
      } else {
        console.log('[DATABASE] Tax settings table check successful');
      }
      
      return true;
    } else {
      console.warn('[DATABASE] ⚠️ Supabase connection failed. Authentication may not work properly.');
      return false;
    }
  } catch (err) {
    console.error('[DATABASE] Error during database initialization:', err);
    return false;
  }
};

// Helper function to log database operations for debugging
export const logDatabaseOperation = (operation: string, success: boolean, details?: any, error?: any) => {
  const timestamp = new Date().toISOString();
  const status = success ? '✅ SUCCESS' : '❌ FAILED';
  
  console.log(`[DATABASE ${timestamp}] ${operation} - ${status}`);
  
  if (details) {
    console.log(`[DATABASE ${timestamp}] Details:`, details);
  }
  
  if (error) {
    console.error(`[DATABASE ${timestamp}] Error:`, error);
  }
  
  return { timestamp, operation, success, details, error };
};

// Create a cache for email confirmation status with expiry
const emailConfirmationCache: Record<string, {status: boolean, timestamp: number}> = {};
const EMAIL_CACHE_TTL = 60000; // 1 minute cache TTL

// Helper to check if a user's email is confirmed
export const checkEmailConfirmation = async (userId: string): Promise<boolean> => {
  try {
    // Check cache first
    const cachedData = emailConfirmationCache[userId];
    const now = Date.now();
    
    if (cachedData && (now - cachedData.timestamp < EMAIL_CACHE_TTL)) {
      // Use cached value if valid
      return cachedData.status;
    }
    
    console.log('[DATABASE] Checking email confirmation for user:', userId);
    
    // FIXED: Don't use the admin API as it causes 403 error, check profile directly
    const { data, error } = await supabase
      .from('profiles')
      .select('email_confirmed')
      .eq('id', userId)
      .single();
      
    if (error) {
      logDatabaseOperation('checkEmailConfirmation', false, { userId }, error);
      console.error('[DATABASE] Error checking email confirmation:', error.message);
      return false;
    }
    
    console.log('[DATABASE] Email confirmation status from profile:', data?.email_confirmed);
    
    // Cache the result
    emailConfirmationCache[userId] = {
      status: data?.email_confirmed || false,
      timestamp: now
    };
    
    return data?.email_confirmed || false;
  } catch (err) {
    logDatabaseOperation('checkEmailConfirmation', false, { userId }, err);
    console.error('[DATABASE] Error checking email confirmation:', err);
    return false;
  }
};
