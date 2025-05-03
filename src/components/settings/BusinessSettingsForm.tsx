
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BusinessSettings } from "@/hooks/useSettings";

interface BusinessSettingsFormProps {
  businessData: BusinessSettings;
  handleBusinessChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCurrencyChange: (value: string) => void;
  handleSaveBusinessSettings: () => Promise<void>;
  isLoading: boolean;
  isSaving: boolean;
  emailConfirmed: boolean;
  currencies: Array<{ value: string; label: string }>;
}

const BusinessSettingsForm: React.FC<BusinessSettingsFormProps> = ({
  businessData,
  handleBusinessChange,
  handleCurrencyChange,
  handleSaveBusinessSettings,
  isLoading,
  isSaving,
  emailConfirmed,
  currencies
}) => {
  return (
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
        <Button 
          onClick={handleSaveBusinessSettings} 
          disabled={isLoading || isSaving || !emailConfirmed}
        >
          {isLoading || isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BusinessSettingsForm;
