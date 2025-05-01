
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useSettings, BusinessSettings, AccountSettings } from "@/hooks/useSettings";
import { useAuth } from '@/contexts/AuthContext';
import DashboardHeader from '@/components/layout/DashboardHeader';

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
  const { isLoading, updateBusinessSettings, updateAccountSettings, fetchUserSettings } = useSettings();

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

  // Load user data when component mounts
  useEffect(() => {
    const loadUserSettings = async () => {
      const settings = await fetchUserSettings();
      
      if (settings) {
        // Update business data
        setBusinessData({
          company_name: settings.company_name || '',
          business_phone: settings.business_phone || '',
          business_website: settings.business_website || '',
          business_address: settings.business_address || '',
          business_city: settings.business_city || '',
          business_state: settings.business_state || '',
          business_postal_code: settings.business_postal_code || '',
          business_country: settings.business_country || '',
          default_currency: settings.default_currency || 'usd'
        });
        
        // Update account data
        setAccountData({
          first_name: settings.first_name,
          last_name: settings.last_name,
          email: settings.email
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
  
  const handleSaveBusinessSettings = async () => {
    if (isLoading) return;
    
    const success = await updateBusinessSettings(businessData);
    
    if (success) {
      toast({
        title: "Business settings updated",
        description: "Your business settings have been saved successfully."
      });
    }
  };
  
  const handleSaveAccountSettings = async () => {
    if (isLoading) return;
    
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

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account and application preferences</p>
        </header>
        
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
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="business_phone">Phone Number</Label>
                    <Input 
                      id="business_phone" 
                      value={businessData.business_phone || ''} 
                      onChange={handleBusinessChange}
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
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="business_address">Address</Label>
                  <Input 
                    id="business_address" 
                    value={businessData.business_address || ''} 
                    onChange={handleBusinessChange}
                  />
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="business_city">City</Label>
                    <Input 
                      id="business_city" 
                      value={businessData.business_city || ''} 
                      onChange={handleBusinessChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="business_state">State/Province</Label>
                    <Input 
                      id="business_state" 
                      value={businessData.business_state || ''} 
                      onChange={handleBusinessChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="business_postal_code">ZIP/Postal Code</Label>
                    <Input 
                      id="business_postal_code" 
                      value={businessData.business_postal_code || ''} 
                      onChange={handleBusinessChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="business_country">Country</Label>
                    <Input 
                      id="business_country" 
                      value={businessData.business_country || ''} 
                      onChange={handleBusinessChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="default_currency">Default Currency</Label>
                  <Select 
                    value={businessData.default_currency || 'usd'} 
                    onValueChange={handleCurrencyChange}
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
                <Button onClick={handleSaveBusinessSettings} disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save Changes'}
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
                  <Label htmlFor="invoicePrefix">Invoice Number Prefix</Label>
                  <Input id="invoicePrefix" defaultValue="INV-" />
                  <p className="text-sm text-gray-500">Your invoice numbers will look like: INV-0001</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="nextInvoiceNumber">Next Invoice Number</Label>
                  <Input id="nextInvoiceNumber" type="number" defaultValue="1001" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="paymentTerms">Default Payment Terms</Label>
                  <Select defaultValue="30">
                    <SelectTrigger id="paymentTerms">
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
                  <Switch id="autoReminders" />
                  <Label htmlFor="autoReminders">Send automatic payment reminders</Label>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => toast({
                  title: "Feature coming soon",
                  description: "Invoice settings will be available in a future update"
                })}>Save Changes</Button>
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
                  <Switch id="taxEnabled" />
                  <Label htmlFor="taxEnabled">Enable tax calculations on invoices</Label>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="defaultTaxRate">Default Tax Rate (%)</Label>
                  <Input id="defaultTaxRate" type="number" defaultValue="10" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="taxName">Tax Name</Label>
                  <Input id="taxName" defaultValue="Sales Tax" />
                  <p className="text-sm text-gray-500">This name will appear on your invoices</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="taxID">Tax Registration Number</Label>
                  <Input id="taxID" defaultValue="TAX-123456789" />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => toast({
                  title: "Feature coming soon",
                  description: "Tax settings will be available in a future update"
                })}>Save Changes</Button>
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
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input 
                      id="last_name" 
                      value={accountData.last_name} 
                      onChange={handleAccountChange}
                      required
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
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch id="twoFactor" disabled />
                  <Label htmlFor="twoFactor">Enable two-factor authentication (Coming soon)</Label>
                </div>
                
                <div className="space-y-2">
                  <Button variant="outline" className="w-full" onClick={() => toast({
                    title: "Feature coming soon",
                    description: "Password change will be available in a future update"
                  })}>Change Password</Button>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveAccountSettings} disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save Changes'}
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
