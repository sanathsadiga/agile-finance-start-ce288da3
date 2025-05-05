
import { useState, useCallback, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, logDatabaseOperation, checkEmailConfirmation } from '@/lib/supabase/database';
import { useToast } from './use-toast';

// Define the business settings type
export interface BusinessSettings {
  company_name: string | null;
  business_phone: string | null;
  business_website: string | null;
  business_address: string | null;
  business_city: string | null;
  business_state: string | null;
  business_postal_code: string | null;
  business_country: string | null;
  default_currency: string | null;
}

// Define the account settings type
export interface AccountSettings {
  first_name: string;
  last_name: string;
  email: string;
}

// Define invoice settings type
export interface InvoiceSettings {
  invoice_prefix: string;
  next_invoice_number: number;
  default_payment_terms: number;
  auto_reminders: boolean;
  notes_default?: string | null;
  terms_default?: string | null;
}

// Define tax settings type
export interface TaxSettings {
  tax_enabled: boolean;
  default_tax_rate: number;
  tax_name: string;
  tax_registration_number: string | null;
}

export const useSettings = () => {
  const { user, setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);
  const [invoiceSettings, setInvoiceSettings] = useState<InvoiceSettings | null>(null);
  const [taxSettings, setTaxSettings] = useState<TaxSettings | null>(null);
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings | null>(null);
  const { toast } = useToast();
  
  // Add refs to track save operation state
  const savingRef = useRef(false); // This ref helps prevent the race condition

  // Check if email is confirmed before allowing settings updates
  const checkCanUpdateSettings = async (): Promise<boolean> => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to update settings",
        variant: "destructive",
      });
      return false;
    }

    // Check if email is confirmed
    const isConfirmed = await checkEmailConfirmation(user.id);
    if (!isConfirmed) {
      toast({
        title: "Email not confirmed",
        description: "Please confirm your email before updating settings",
        variant: "destructive",
      });
      console.log("[SETTINGS] Email not confirmed for user", user.id);
      return false;
    }

    return true;
  };

  const updateBusinessSettings = useCallback(async (settings: BusinessSettings) => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to update settings",
        variant: "destructive",
      });
      return false;
    }

    // Check if email is confirmed
    const isConfirmed = await checkCanUpdateSettings();
    if (!isConfirmed) {
      return false;
    }
    
    // FIXED: Use ref to prevent race condition in rapid saves
    if (savingRef.current) {
      console.log('[SETTINGS] Already saving business settings, ignoring request');
      toast({
        title: "Please wait",
        description: "Your previous changes are still being saved",
      });
      return false;
    }

    try {
      savingRef.current = true; // Set ref to true first
      setIsSaving(true);
      setIsLoading(true);
      console.log('[SETTINGS] Updating business settings for user:', user.id);

      const { data, error } = await supabase
        .from('profiles')
        .update({
          company_name: settings.company_name,
          business_phone: settings.business_phone,
          business_website: settings.business_website,
          business_address: settings.business_address,
          business_city: settings.business_city,
          business_state: settings.business_state,
          business_postal_code: settings.business_postal_code,
          business_country: settings.business_country,
          default_currency: settings.default_currency,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select();

      if (error) {
        logDatabaseOperation('updateBusinessSettings', false, { userId: user.id }, error);
        toast({
          title: "Update failed",
          description: error.message || "Failed to update business settings",
          variant: "destructive",
        });
        return false;
      }

      logDatabaseOperation('updateBusinessSettings', true, { userId: user.id, updatedFields: Object.keys(settings).length });

      // Update the user context with new data
      if (data && data[0]) {
        setUser({
          ...user,
          companyName: data[0].company_name,
        });
        
        // Update local business settings state
        setBusinessSettings(settings);
      }

      setLastSaveTime(new Date());
      toast({
        title: "Settings updated",
        description: "Your business settings have been updated successfully",
      });
      return true;
    } catch (err: any) {
      logDatabaseOperation('updateBusinessSettings', false, { userId: user.id }, err);
      toast({
        title: "Update failed",
        description: err?.message || "An unknown error occurred",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
      // Add a small delay before allowing another save to prevent rapid multiple saves
      setTimeout(() => {
        savingRef.current = false; // Reset ref
        setIsSaving(false);
      }, 500);
    }
  }, [user, toast, setUser]);

  const updateAccountSettings = useCallback(async (settings: AccountSettings) => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to update settings",
        variant: "destructive",
      });
      return false;
    }

    // Check if email is confirmed
    const isConfirmed = await checkCanUpdateSettings();
    if (!isConfirmed) {
      return false;
    }

    // FIXED: Use ref to prevent race condition in rapid saves
    if (savingRef.current) {
      console.log('[SETTINGS] Already saving account settings, ignoring request');
      toast({
        title: "Please wait",
        description: "Your previous changes are still being saved",
      });
      return false;
    }

    try {
      savingRef.current = true; // Set ref to true first
      setIsSaving(true);
      setIsLoading(true);
      console.log('[SETTINGS] Updating account settings for user:', user.id);

      // Update profile in database
      const { data, error } = await supabase
        .from('profiles')
        .update({
          first_name: settings.first_name,
          last_name: settings.last_name,
          email: settings.email,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select();

      if (error) {
        logDatabaseOperation('updateAccountSettings', false, { userId: user.id }, error);
        toast({
          title: "Update failed",
          description: error.message || "Failed to update account settings",
          variant: "destructive",
        });
        return false;
      }

      logDatabaseOperation('updateAccountSettings', true, { userId: user.id });

      // Update user information in settings tables for better identification
      await updateUserInfoInSettings(user.id, settings.email, `${settings.first_name} ${settings.last_name}`);

      // Update the user context with new data
      if (data && data[0]) {
        setUser({
          ...user,
          firstName: data[0].first_name,
          lastName: data[0].last_name,
          email: data[0].email,
        });
      }

      setLastSaveTime(new Date());
      toast({
        title: "Settings updated",
        description: "Your account settings have been updated successfully",
      });
      return true;
    } catch (err: any) {
      logDatabaseOperation('updateAccountSettings', false, { userId: user.id }, err);
      toast({
        title: "Update failed",
        description: err?.message || "An unknown error occurred",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
      // Add a small delay before allowing another save to prevent rapid multiple saves
      setTimeout(() => {
        savingRef.current = false; // Reset ref
        setIsSaving(false);
      }, 500);
    }
  }, [user, toast, setUser]);

  const updateInvoiceSettings = useCallback(async (settings: InvoiceSettings) => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to update settings",
        variant: "destructive",
      });
      return false;
    }

    // Check if email is confirmed
    const isConfirmed = await checkCanUpdateSettings();
    if (!isConfirmed) {
      return false;
    }

    // FIXED: Use ref to prevent race condition in rapid saves
    if (savingRef.current) {
      console.log('[SETTINGS] Already saving invoice settings, ignoring request');
      toast({
        title: "Please wait",
        description: "Your previous changes are still being saved",
      });
      return false;
    }

    try {
      savingRef.current = true; // Set ref to true first
      setIsSaving(true);
      setIsLoading(true);
      console.log('[SETTINGS] Updating invoice settings for user:', user.id);

      const { data, error } = await supabase
        .from('invoice_settings')
        .update({
          invoice_prefix: settings.invoice_prefix,
          next_invoice_number: settings.next_invoice_number,
          default_payment_terms: settings.default_payment_terms,
          auto_reminders: settings.auto_reminders,
          notes_default: settings.notes_default,
          terms_default: settings.terms_default,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .select();

      if (error) {
        logDatabaseOperation('updateInvoiceSettings', false, { userId: user.id }, error);
        toast({
          title: "Update failed",
          description: error.message || "Failed to update invoice settings",
          variant: "destructive",
        });
        return false;
      }

      logDatabaseOperation('updateInvoiceSettings', true, { userId: user.id });
      
      setLastSaveTime(new Date());
      toast({
        title: "Settings updated",
        description: "Your invoice settings have been updated successfully",
      });
      
      // Update local state with new settings
      if (data && data[0]) {
        setInvoiceSettings(data[0] as InvoiceSettings);
      }
      
      return true;
    } catch (err: any) {
      logDatabaseOperation('updateInvoiceSettings', false, { userId: user.id }, err);
      toast({
        title: "Update failed",
        description: err?.message || "An unknown error occurred",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
      // Add a small delay before allowing another save to prevent rapid multiple saves
      setTimeout(() => {
        savingRef.current = false; // Reset ref
        setIsSaving(false);
      }, 500);
    }
  }, [user, toast]);

  const updateTaxSettings = useCallback(async (settings: TaxSettings) => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to update settings",
        variant: "destructive",
      });
      return false;
    }

    // Check if email is confirmed
    const isConfirmed = await checkCanUpdateSettings();
    if (!isConfirmed) {
      return false;
    }

    // FIXED: Use ref to prevent race condition in rapid saves
    if (savingRef.current) {
      console.log('[SETTINGS] Already saving tax settings, ignoring request');
      toast({
        title: "Please wait",
        description: "Your previous changes are still being saved",
      });
      return false;
    }

    try {
      savingRef.current = true; // Set ref to true first
      setIsSaving(true);
      setIsLoading(true);
      console.log('[SETTINGS] Updating tax settings for user:', user.id);

      const { data, error } = await supabase
        .from('tax_settings')
        .update({
          tax_enabled: settings.tax_enabled,
          default_tax_rate: settings.default_tax_rate,
          tax_name: settings.tax_name,
          tax_registration_number: settings.tax_registration_number,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .select();

      if (error) {
        logDatabaseOperation('updateTaxSettings', false, { userId: user.id }, error);
        toast({
          title: "Update failed",
          description: error.message || "Failed to update tax settings",
          variant: "destructive",
        });
        return false;
      }

      logDatabaseOperation('updateTaxSettings', true, { userId: user.id });
      
      setLastSaveTime(new Date());
      toast({
        title: "Settings updated",
        description: "Your tax settings have been updated successfully",
      });
      
      // Update local state with new settings
      if (data && data[0]) {
        setTaxSettings(data[0] as TaxSettings);
      }
      
      return true;
    } catch (err: any) {
      logDatabaseOperation('updateTaxSettings', false, { userId: user.id }, err);
      toast({
        title: "Update failed",
        description: err?.message || "An unknown error occurred",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
      // Add a small delay before allowing another save to prevent rapid multiple saves
      setTimeout(() => {
        savingRef.current = false; // Reset ref
        setIsSaving(false);
      }, 500);
    }
  }, [user, toast]);

  // Helper function to update user info in settings tables
  const updateUserInfoInSettings = async (userId: string, email: string, fullName: string): Promise<void> => {
    try {
      // Update in invoice settings
      await supabase
        .from('invoice_settings')
        .update({
          user_email: email,
          user_name: fullName
        })
        .eq('user_id', userId);
        
      // Update in tax settings  
      await supabase
        .from('tax_settings')
        .update({
          user_email: email,
          user_name: fullName
        })
        .eq('user_id', userId);
        
      logDatabaseOperation('updateUserInfoInSettings', true, { userId });
    } catch (err) {
      logDatabaseOperation('updateUserInfoInSettings', false, { userId }, err);
      console.error('[SETTINGS] Failed to update user info in settings tables:', err);
    }
  };

  const fetchUserProfile = async () => {
    if (!user?.id) {
      return null;
    }
  
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
  
      if (error) {
        logDatabaseOperation('fetchUserProfile', false, { userId: user.id }, error);
        toast({
          title: "Error",
          description: "Failed to load user profile",
          variant: "destructive",
        });
        return null;
      }
  
      logDatabaseOperation('fetchUserProfile', true, { userId: user.id });
      
      // Update user object if email confirmation status changed
      if (data.email_confirmed && (!user.emailConfirmed)) {
        setUser({
          ...user,
          emailConfirmed: data.email_confirmed
        });
      }
      
      // Set business settings from profile data
      const businessData: BusinessSettings = {
        company_name: data.company_name,
        business_phone: data.business_phone,
        business_website: data.business_website,
        business_address: data.business_address,
        business_city: data.business_city,
        business_state: data.business_state,
        business_postal_code: data.business_postal_code,
        business_country: data.business_country,
        default_currency: data.default_currency || 'USD'
      };
      
      setBusinessSettings(businessData);
      
      return data;
    } catch (err) {
      logDatabaseOperation('fetchUserProfile', false, { userId: user.id }, err);
      return null;
    }
  };
  
  const fetchInvoiceSettings = useCallback(async () => {
    if (!user?.id) {
      return null;
    }
  
    try {
      const { data, error } = await supabase
        .from('invoice_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();
  
      if (error) {
        logDatabaseOperation('fetchInvoiceSettings', false, { userId: user.id }, error);
        
        // If no invoice settings exist, create default ones
        if (error.code === 'PGRST116') {
          console.log('[SETTINGS] No invoice settings found, creating defaults');
          const defaultSettings = {
            invoice_prefix: 'INV-',
            next_invoice_number: 1001,
            default_payment_terms: 30,
            auto_reminders: false
          };
          
          const { data: newData, error: insertError } = await supabase
            .from('invoice_settings')
            .insert({
              user_id: user.id,
              user_email: user.email,
              user_name: `${user.firstName} ${user.lastName}`,
              ...defaultSettings
            })
            .select();
            
          if (insertError) {
            logDatabaseOperation('createInvoiceSettings', false, { userId: user.id }, insertError);
            return defaultSettings;
          }
          
          logDatabaseOperation('createInvoiceSettings', true, { userId: user.id });
          
          const result = newData?.[0] || defaultSettings;
          setInvoiceSettings(result as InvoiceSettings);
          return result;
        }
        
        toast({
          title: "Error",
          description: "Failed to load invoice settings",
          variant: "destructive",
        });
        return null;
      }
  
      logDatabaseOperation('fetchInvoiceSettings', true, { userId: user.id });
      setInvoiceSettings(data as InvoiceSettings);
      return data;
    } catch (err) {
      logDatabaseOperation('fetchInvoiceSettings', false, { userId: user.id }, err);
      return null;
    }
  }, [user, toast, setUser]);
  
  const fetchTaxSettings = useCallback(async () => {
    if (!user?.id) {
      return null;
    }
  
    try {
      const { data, error } = await supabase
        .from('tax_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();
  
      if (error) {
        logDatabaseOperation('fetchTaxSettings', false, { userId: user.id }, error);
        
        // If no tax settings exist, create default ones
        if (error.code === 'PGRST116') {
          console.log('[SETTINGS] No tax settings found, creating defaults');
          const defaultSettings = {
            tax_enabled: false,
            default_tax_rate: 10,
            tax_name: 'Sales Tax',
            tax_registration_number: null
          };
          
          const { data: newData, error: insertError } = await supabase
            .from('tax_settings')
            .insert({
              user_id: user.id,
              user_email: user.email,
              user_name: `${user.firstName} ${user.lastName}`,
              ...defaultSettings
            })
            .select();
            
          if (insertError) {
            logDatabaseOperation('createTaxSettings', false, { userId: user.id }, insertError);
            return defaultSettings;
          }
          
          logDatabaseOperation('createTaxSettings', true, { userId: user.id });
          
          const result = newData?.[0] || defaultSettings;
          setTaxSettings(result as TaxSettings);
          return result;
        }
        
        toast({
          title: "Error",
          description: "Failed to load tax settings",
          variant: "destructive",
        });
        return null;
      }
  
      logDatabaseOperation('fetchTaxSettings', true, { userId: user.id });
      setTaxSettings(data as TaxSettings);
      return data;
    } catch (err) {
      logDatabaseOperation('fetchTaxSettings', false, { userId: user.id }, err);
      return null;
    }
  }, [user, toast, setUser]);

  // Add a function to refresh invoice settings
  const refreshInvoiceSettings = useCallback(async () => {
    return await fetchInvoiceSettings();
  }, [fetchInvoiceSettings]);

  // Load settings on hook initialization
  useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchInvoiceSettings();
      fetchTaxSettings();
    }
  }, [user, fetchInvoiceSettings, fetchTaxSettings]);

  return {
    isLoading,
    isSaving,
    lastSaveTime,
    invoiceSettings,
    taxSettings,
    businessSettings,
    updateBusinessSettings,
    updateAccountSettings,
    updateInvoiceSettings,
    updateTaxSettings,
    fetchUserProfile,
    fetchInvoiceSettings,
    fetchTaxSettings,
    refreshInvoiceSettings,
    checkEmailConfirmation,
  };
};

