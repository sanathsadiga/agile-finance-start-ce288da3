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

  const [emailConfirmed, setEmailConfirmed] = useState<boolean>(true);

  // Use the settings directly from the hook instead of maintaining separate state
  const [businessData, setBusinessData] = useState<BusinessSettings>({});
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

  // Update local state when settings from hook change
  useEffect(() => {
    console.log('Business settings updated from hook:', businessSettings);
    setBusinessData(businessSettings);
  }, [businessSettings]);

  useEffect(() => {
    setAccountData(accountSettings);
  }, [accountSettings]);

  // Remove the complex useEffect that was causing issues and just sync with hook data
  useEffect(() => {
    if (!user?.id) return;
    
    console.log('[SETTINGS] User loaded, settings will be fetched by useSettings hook');
    setEmailConfirmed(true);
    
    // Load other settings
    const loadOtherSettings = async () => {
      try {
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
        
        const taxSettingsData = await fetchTaxSettings();
        if (taxSettingsData) {
          setTaxData({
            tax_enabled: taxSettingsData.tax_enabled || false,
            default_tax_rate: taxSettingsData.default_tax_rate || 10,
            tax_name: taxSettingsData.tax_name || 'Sales Tax',
            tax_registration_number: taxSettingsData.tax_registration_number || ''
          });
        }
      } catch (error) {
        console.error('[SETTINGS] Error loading other settings:', error);
      }
    };

    loadOtherSettings();
  }, [user?.id]);

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

}
