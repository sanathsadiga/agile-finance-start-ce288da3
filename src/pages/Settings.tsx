
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSettings, BusinessSettings, AccountSettings, InvoiceSettings, TaxSettings } from "@/hooks/useSettings";
import { useAuth } from '@/contexts/AuthContext';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { checkEmailConfirmation } from '@/lib/supabase/database';

const currencies = [
  { value: "usd", label: "USD - US Dollar" },
  { value: "eur", label: "EUR - Euro" },
  { value: "gbp", label: "GBP - British Pound" },
  { value: "cad", label: "CAD - Canadian Dollar" },
  { value: "aud", label: "AUD - Australian Dollar" },
  { value: "jpy", label: "JPY - Japanese Yen" }
];

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

  // Load user data when component mounts
  useEffect(() => {
    const loadUserSettings = async () => {
      console.log('[SETTINGS] Loading user settings');
      
      try {
        // Check if email is confirmed
        if (user?.id) {
          const isConfirmed = await checkEmailConfirmation(user.id);
          console.log('[SETTINGS] Email confirmation status:', isConfirmed);
          setEmailConfirmed(isConfirmed);
        }
        
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
  }, [user]);

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
        
        {!emailConfirmed && user && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Email Not Confirmed</AlertTitle>
            <AlertDescription>
              Please confirm your email address to enable editing of settings. Check your inbox for a confirmation link.
            </AlertDescription>
          </Alert>
        )}
        
        <Tabs defaultValue="business">
          <TabsList className="mb-8">
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="taxes">Taxes</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>
          
          <TabsContent value="business">
            <Card>
              <CardHeader>
                <CardTitle>Business Details</CardTitle>
                <CardDescription>
                  Update your business information that will appear on your invoices and reports
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="company_name">Business Name</Label>
                    <Input 
                      id="company_name" 
                      value={businessData.company_name || ''} 
                      onChange={handleBusinessChange}
                      disabled={!emailConfirmed}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="business_phone">Phone Number</Label>
                    <Input 
                      id="business_phone" 
                      value={businessData.business_phone || ''} 
                      onChange={handleBusinessChange}
                      disabled={!emailConfirmed}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="business_website">Website</Label>
                  <Input 
                    id="business_website" 
                    value={businessData.business_website || ''} 
                    onChange={handleBusinessChange}
                    placeholder="https://www.example.com"
                    disabled={!emailConfirmed}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="business_address">Address</Label>
                  <Input 
                    id="business_address" 
                    value={businessData.business_address || ''} 
                    onChange={handleBusinessChange}
                    disabled={!emailConfirmed}
                  />
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="business_city">City</Label>
                    <Input 
                      id="business_city" 
                      value={businessData.business_city || ''} 
                      onChange={handleBusinessChange}
                      disabled={!emailConfirmed}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="business_state">State/Province</Label>
                    <Input 
                      id="business_state" 
                      value={businessData.business_state || ''} 
                      onChange={handleBusinessChange}
                      disabled={!emailConfirmed}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="business_postal_code">ZIP/Postal Code</Label>
                    <Input 
                      id="business_postal_code" 
                      value={businessData.business_postal_code || ''} 
                      onChange={handleBusinessChange}
                      disabled={!emailConfirmed}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="business_country">Country</Label>
                    <Input 
                      id="business_country" 
                      value={businessData.business_country || ''} 
                      onChange={handleBusinessChange}
                      disabled={!emailConfirmed}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="default_currency">Default Currency</Label>
                  <Select 
                    value={businessData.default_currency || 'usd'} 
                    onValueChange={handleCurrencyChange}
                    disabled={!emailConfirmed}
                  >
                    <SelectTrigger id="default_currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.value} value={currency.value}>
                          {currency.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveBusinessSettings} disabled={isLoading || isSaving || !emailConfirmed}>
                  {isLoading || isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="invoices">
            <Card>
              <CardHeader>
                <CardTitle>Invoice Settings</CardTitle>
                <CardDescription>
                  Customize how your invoices look and behave
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="invoice_prefix">Invoice Number Prefix</Label>
                  <Input 
                    id="invoice_prefix" 
                    value={invoiceData.invoice_prefix} 
                    onChange={handleInvoiceChange}
                    disabled={!emailConfirmed}
                  />
                  <p className="text-sm text-gray-500">Your invoice numbers will look like: {invoiceData.invoice_prefix}{invoiceData.next_invoice_number}</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="next_invoice_number">Next Invoice Number</Label>
                  <Input 
                    id="next_invoice_number" 
                    type="number" 
                    value={invoiceData.next_invoice_number} 
                    onChange={handleInvoiceChange}
                    disabled={!emailConfirmed}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="default_payment_terms">Default Payment Terms</Label>
                  <Select 
                    value={String(invoiceData.default_payment_terms)}
                    onValueChange={(value) => handleInvoiceSelectChange('default_payment_terms', Number(value))}
                    disabled={!emailConfirmed}
                  >
                    <SelectTrigger id="default_payment_terms">
                      <SelectValue placeholder="Select payment terms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">Due in 7 days</SelectItem>
                      <SelectItem value="14">Due in 14 days</SelectItem>
                      <SelectItem value="30">Due in 30 days</SelectItem>
                      <SelectItem value="60">Due in 60 days</SelectItem>
                      <SelectItem value="0">Due on receipt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="auto_reminders" 
                    checked={invoiceData.auto_reminders}
                    onCheckedChange={(checked) => handleInvoiceToggleChange('auto_reminders', checked)}
                    disabled={!emailConfirmed}
                  />
                  <Label htmlFor="auto_reminders">Send automatic payment reminders</Label>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleSaveInvoiceSettings} 
                  disabled={isLoading || isSaving || !emailConfirmed}
                >
                  {isLoading || isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="taxes">
            <Card>
              <CardHeader>
                <CardTitle>Tax Settings</CardTitle>
                <CardDescription>
                  Configure tax rates and rules for your invoices
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="tax_enabled" 
                    checked={taxData.tax_enabled}
                    onCheckedChange={handleTaxToggleChange}
                    disabled={!emailConfirmed}
                  />
                  <Label htmlFor="tax_enabled">Enable tax calculations on invoices</Label>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="default_tax_rate">Default Tax Rate (%)</Label>
                  <Input 
                    id="default_tax_rate" 
                    type="number" 
                    value={taxData.default_tax_rate} 
                    onChange={handleTaxChange}
                    disabled={!emailConfirmed || !taxData.tax_enabled}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tax_name">Tax Name</Label>
                  <Input 
                    id="tax_name" 
                    value={taxData.tax_name} 
                    onChange={handleTaxChange}
                    disabled={!emailConfirmed || !taxData.tax_enabled}
                  />
                  <p className="text-sm text-gray-500">This name will appear on your invoices</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tax_registration_number">Tax Registration Number</Label>
                  <Input 
                    id="tax_registration_number" 
                    value={taxData.tax_registration_number || ''} 
                    onChange={handleTaxChange}
                    disabled={!emailConfirmed || !taxData.tax_enabled}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleSaveTaxSettings} 
                  disabled={isLoading || isSaving || !emailConfirmed}
                >
                  {isLoading || isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account details and security
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input 
                      id="first_name" 
                      value={accountData.first_name} 
                      onChange={handleAccountChange}
                      required
                      disabled={!emailConfirmed}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input 
                      id="last_name" 
                      value={accountData.last_name} 
                      onChange={handleAccountChange}
                      required
                      disabled={!emailConfirmed}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={accountData.email} 
                    onChange={handleAccountChange}
                    required
                    disabled={!emailConfirmed}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch id="twoFactor" disabled />
                  <Label htmlFor="twoFactor">Enable two-factor authentication (Coming soon)</Label>
                </div>
                
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => toast({
                      title: "Feature coming soon",
                      description: "Password change will be available in a future update"
                    })}
                    disabled={!emailConfirmed}
                  >
                    Change Password
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleSaveAccountSettings} 
                  disabled={isLoading || isSaving || !emailConfirmed}
                >
                  {isLoading || isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
