import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useSettings, BusinessSettings, AccountSettings, InvoiceSettings, TaxSettings } from "@/hooks/useSettings";
import { useAuth } from '@/contexts/AuthContext';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { checkEmailConfirmation } from '@/lib/supabase/database';

// Import our extracted components
import BusinessSettingsForm from '@/components/settings/BusinessSettingsForm';
import InvoiceSettingsForm from '@/components/settings/InvoiceSettingsForm';
import TaxSettingsForm from '@/components/settings/TaxSettingsForm';
import AccountSettingsForm from '@/components/settings/AccountSettingsForm';
import EmailConfirmationAlert from '@/components/settings/EmailConfirmationAlert';
import { currencies } from '@/components/settings/SettingsConstants';

const Settings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { 
    isLoading, 
    isSaving,
    updateBusinessSettings, 
    updateAccountSettings, 
    updateInvoiceSettings,
    updateTaxSettings,
    fetchUserProfile,
    fetchInvoiceSettings,
    fetchTaxSettings
  } = useSettings();

  const [emailConfirmed, setEmailConfirmed] = useState<boolean>(false);
  const [lastLoadTime, setLastLoadTime] = useState<Date>(new Date());

  const [businessData, setBusinessData] = useState<BusinessSettings>({
    company_name: '',
    business_phone: '',
    business_website: '',
    business_address: '',
    business_city: '',
    business_state: '',
    business_postal_code: '',
    business_country: '',
    default_currency: 'usd'
  });

  const [accountData, setAccountData] = useState<AccountSettings>({
    first_name: '',
    last_name: '',
    email: ''
  });
  
  const [invoiceData, setInvoiceData] = useState<InvoiceSettings>({
    invoice_prefix: 'INV-',
    next_invoice_number: 1001,
    default_payment_terms: 30,
    auto_reminders: false
  });
  
  const [taxData, setTaxData] = useState<TaxSettings>({
    tax_enabled: false,
    default_tax_rate: 10,
    tax_name: 'Sales Tax',
    tax_registration_number: null
  });

  // Fix infinite loop by only loading settings once or when user changes
  useEffect(() => {
    const loadUserSettings = async () => {
      if (!user?.id) return;
      
      console.log('[SETTINGS] Loading user settings');
      
      try {
        // Check if email is confirmed
        const isConfirmed = await checkEmailConfirmation(user.id);
        console.log('[SETTINGS] Email confirmation status:', isConfirmed);
        setEmailConfirmed(isConfirmed);
        
        // Load user profile data
        const profile = await fetchUserProfile();
        
        if (profile) {
          // Update business data
          setBusinessData({
            company_name: profile.company_name || '',
            business_phone: profile.business_phone || '',
            business_website: profile.business_website || '',
            business_address: profile.business_address || '',
            business_city: profile.business_city || '',
            business_state: profile.business_state || '',
            business_postal_code: profile.business_postal_code || '',
            business_country: profile.business_country || '',
            default_currency: profile.default_currency || 'usd'
          });
          
          // Update account data
          setAccountData({
            first_name: profile.first_name,
            last_name: profile.last_name,
            email: profile.email
          });
        } else if (user) {
          // Fallback to user context if we can't fetch from database
          setAccountData({
            first_name: user.firstName,
            last_name: user.lastName,
            email: user.email
          });
          
          if (user.companyName) {
            setBusinessData({
              ...businessData,
              company_name: user.companyName
            });
          }
        }
        
        // Load invoice settings
        const invoiceSettings = await fetchInvoiceSettings();
        if (invoiceSettings) {
          setInvoiceData({
            invoice_prefix: invoiceSettings.invoice_prefix || 'INV-',
            next_invoice_number: invoiceSettings.next_invoice_number || 1001,
            default_payment_terms: invoiceSettings.default_payment_terms || 30,
            auto_reminders: invoiceSettings.auto_reminders || false,
            notes_default: invoiceSettings.notes_default || null,
            terms_default: invoiceSettings.terms_default || null
          });
        }
        
        // Load tax settings
        const taxSettings = await fetchTaxSettings();
        if (taxSettings) {
          setTaxData({
            tax_enabled: taxSettings.tax_enabled || false,
            default_tax_rate: taxSettings.default_tax_rate || 10,
            tax_name: taxSettings.tax_name || 'Sales Tax',
            tax_registration_number: taxSettings.tax_registration_number || null
          });
        }
        
        setLastLoadTime(new Date());
      } catch (error) {
        console.error('[SETTINGS] Error loading settings:', error);
        toast({
          title: 'Error loading settings',
          description: 'There was a problem loading your settings. Please try again.',
          variant: 'destructive'
        });
      }
    };

    loadUserSettings();
  }, [user?.id]); // Only load when user ID changes

  const handleBusinessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setBusinessData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setAccountData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleCurrencyChange = (value: string) => {
    setBusinessData(prev => ({
      ...prev,
      default_currency: value
    }));
  };
  
  const handleInvoiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type } = e.target;
    setInvoiceData(prev => ({
      ...prev,
      [id]: type === 'number' ? Number(value) : value
    }));
  };
  
  const handleInvoiceSelectChange = (field: string, value: any) => {
    setInvoiceData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleInvoiceToggleChange = (field: string, checked: boolean) => {
    setInvoiceData(prev => ({
      ...prev,
      [field]: checked
    }));
  };
  
  const handleTaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type } = e.target;
    setTaxData(prev => ({
      ...prev,
      [id]: type === 'number' ? Number(value) : value
    }));
  };
  
  const handleTaxToggleChange = (checked: boolean) => {
    setTaxData(prev => ({
      ...prev,
      tax_enabled: checked
    }));
  };
  
  const handleSaveBusinessSettings = async () => {
    if (isLoading || isSaving) return;
    
    // Check if email is confirmed
    if (!emailConfirmed) {
      toast({
        title: "Email not confirmed",
        description: "Please confirm your email before updating settings",
        variant: "destructive"
      });
      return;
    }
    
    const success = await updateBusinessSettings(businessData);
    
    if (success) {
      toast({
        title: "Business settings updated",
        description: "Your business settings have been saved successfully."
      });
    }
  };
  
  const handleSaveAccountSettings = async () => {
    if (isLoading || isSaving) return;
    
    // Check if email is confirmed
    if (!emailConfirmed) {
      toast({
        title: "Email not confirmed",
        description: "Please confirm your email before updating settings",
        variant: "destructive"
      });
      return;
    }
    
    // Basic validation
    if (!accountData.first_name || !accountData.last_name || !accountData.email) {
      toast({
        title: "Validation error",
        description: "All account fields are required",
        variant: "destructive"
      });
      return;
    }
    
    const success = await updateAccountSettings(accountData);
    
    if (success) {
      toast({
        title: "Account settings updated",
        description: "Your account settings have been saved successfully."
      });
    }
  };
  
  const handleSaveInvoiceSettings = async () => {
    if (isLoading || isSaving) return;
    
    // Check if email is confirmed
    if (!emailConfirmed) {
      toast({
        title: "Email not confirmed",
        description: "Please confirm your email before updating settings",
        variant: "destructive"
      });
      return;
    }
    
    const success = await updateInvoiceSettings(invoiceData);
    
    if (success) {
      toast({
        title: "Invoice settings updated",
        description: "Your invoice settings have been saved successfully."
      });
    }
  };
  
  const handleSaveTaxSettings = async () => {
    if (isLoading || isSaving) return;
    
    // Check if email is confirmed
    if (!emailConfirmed) {
      toast({
        title: "Email not confirmed",
        description: "Please confirm your email before updating settings",
        variant: "destructive"
      });
      return;
    }
    
    const success = await updateTaxSettings(taxData);
    
    if (success) {
      toast({
        title: "Tax settings updated",
        description: "Your tax settings have been saved successfully."
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account and application preferences</p>
        </header>
        
        <EmailConfirmationAlert emailConfirmed={emailConfirmed} />
        
        <Tabs defaultValue="business">
          <TabsList className="mb-8">
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="taxes">Taxes</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>
          
          <TabsContent value="business">
            <BusinessSettingsForm 
              businessData={businessData}
              handleBusinessChange={handleBusinessChange}
              handleCurrencyChange={handleCurrencyChange}
              handleSaveBusinessSettings={handleSaveBusinessSettings}
              isLoading={isLoading}
              isSaving={isSaving}
              emailConfirmed={emailConfirmed}
              currencies={currencies}
            />
          </TabsContent>
          
          <TabsContent value="invoices">
            <InvoiceSettingsForm 
              invoiceData={invoiceData}
              handleInvoiceChange={handleInvoiceChange}
              handleInvoiceSelectChange={handleInvoiceSelectChange}
              handleInvoiceToggleChange={handleInvoiceToggleChange}
              handleSaveInvoiceSettings={handleSaveInvoiceSettings}
              isLoading={isLoading}
              isSaving={isSaving}
              emailConfirmed={emailConfirmed}
            />
          </TabsContent>
          
          <TabsContent value="taxes">
            <TaxSettingsForm 
              taxData={taxData}
              handleTaxChange={handleTaxChange}
              handleTaxToggleChange={handleTaxToggleChange}
              handleSaveTaxSettings={handleSaveTaxSettings}
              isLoading={isLoading}
              isSaving={isSaving}
              emailConfirmed={emailConfirmed}
            />
          </TabsContent>
          
          <TabsContent value="account">
            <AccountSettingsForm 
              accountData={accountData}
              handleAccountChange={handleAccountChange}
              handleSaveAccountSettings={handleSaveAccountSettings}
              isLoading={isLoading}
              isSaving={isSaving}
              emailConfirmed={emailConfirmed}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
