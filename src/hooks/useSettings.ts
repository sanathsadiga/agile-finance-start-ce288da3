
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase/database';
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

export const useSettings = () => {
  const { user, setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const updateBusinessSettings = async (settings: BusinessSettings) => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to update settings",
        variant: "destructive",
      });
      return false;
    }

    setIsLoading(true);
    try {
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
        console.error('Error updating business settings:', error);
        toast({
          title: "Update failed",
          description: error.message || "Failed to update business settings",
          variant: "destructive",
        });
        return false;
      }

      // Update the user context with new data
      if (data && data[0]) {
        setUser({
          ...user,
          companyName: data[0].company_name,
        });
      }

      toast({
        title: "Settings updated",
        description: "Your business settings have been updated successfully",
      });
      return true;
    } catch (err: any) {
      console.error('Error in updateBusinessSettings:', err);
      toast({
        title: "Update failed",
        description: err?.message || "An unknown error occurred",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateAccountSettings = async (settings: AccountSettings) => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to update settings",
        variant: "destructive",
      });
      return false;
    }

    setIsLoading(true);
    try {
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
        console.error('Error updating account settings:', error);
        toast({
          title: "Update failed",
          description: error.message || "Failed to update account settings",
          variant: "destructive",
        });
        return false;
      }

      // Update the user context with new data
      if (data && data[0]) {
        setUser({
          ...user,
          firstName: data[0].first_name,
          lastName: data[0].last_name,
          email: data[0].email,
        });
      }

      toast({
        title: "Settings updated",
        description: "Your account settings have been updated successfully",
      });
      return true;
    } catch (err: any) {
      console.error('Error in updateAccountSettings:', err);
      toast({
        title: "Update failed",
        description: err?.message || "An unknown error occurred",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserSettings = async () => {
    if (!user?.id) {
      return null;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user settings:', error);
        toast({
          title: "Error",
          description: "Failed to load user settings",
          variant: "destructive",
        });
        return null;
      }

      return data;
    } catch (err) {
      console.error('Error in fetchUserSettings:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    updateBusinessSettings,
    updateAccountSettings,
    fetchUserSettings,
  };
};
