
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useSettings, BusinessSettings, AccountSettings, InvoiceSettings, TaxSettings } from "@/hooks/useSettings";
import { useAuth } from '@/contexts/AuthContext';
import DashboardHeader from '@/components/layout/DashboardHeader';

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
    businessSettings,
    accountSettings,
    invoiceSettings,
    taxSettings,
    updateBusinessSettings, 
    updateAccountSettings, 
    updateInvoiceSettings,
    updateTaxSettings,
    fetchUserProfile,
    fetchInvoiceSettings,
    fetchTaxSettings
  } = useSettings();

  const [emailConfirmed, setEmailConfirmed] = useState<boolean>(true); // Mock as confirmed for now
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
    tax_registration_number: ''
  });

  // Fix infinite loop by only loading settings once or when user changes
  useEffect(() => {
    const loadUserSettings = async () => {
      if (!user?.id) return;
      
      console.log('[SETTINGS] Loading user settings');
      
      try {
        // Mock email confirmation as true for now
        setEmailConfirmed(true);
        
        // Load user profile data
        const profile = await fetchUserProfile();
        
        if (profile) {
          // Update business data
          setBusinessData({
            company_name: businessSettings.company_name || '',
            business_phone: businessSettings.business_phone || '',
            business_website: businessSettings.business_website || '',
            business_address: businessSettings.business_address || '',
            business_city: businessSettings.business_city || '',
            business_state: businessSettings.business_state || '',
            business_postal_code: businessSettings.business_postal_code || '',
            business_country: businessSettings.business_country || '',
            default_currency: businessSettings.default_currency || 'usd'
          });
          
          // Update account data
          setAccountData({
            first_name: accountSettings.first_name,
            last_name: accountSettings.last_name,
            email: accountSettings.email
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
        const invoiceSettingsData = await fetchInvoiceSettings();
        if (invoiceSettingsData) {
          setInvoiceData({
            invoice_prefix: invoiceSettingsData.invoice_prefix || 'INV-',
            next_invoice_number: invoiceSettingsData.next_invoice_number || 1001,
            default_payment_terms: invoiceSettingsData.default_payment_terms || 30,
            auto_reminders: invoiceSettingsData.auto_reminders || false,
            notes_default: invoiceSettingsData.notes_default || '',
            terms_default: invoiceSettingsData.terms_default || ''
          });
        }
        
        // Load tax settings
        const taxSettingsData = await fetchTaxSettings();
        if (taxSettingsData) {
          setTaxData({
            tax_enabled: taxSettingsData.tax_enabled || false,
            default_tax_rate: taxSettingsData.default_tax_rate || 10,
            tax_name: taxSettingsData.tax_name || 'Sales Tax',
            tax_registration_number: taxSettingsData.tax_registration_number || ''
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
