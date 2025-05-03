
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { TaxSettings } from "@/hooks/useSettings";

interface TaxSettingsFormProps {
  taxData: TaxSettings;
  handleTaxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTaxToggleChange: (checked: boolean) => void;
  handleSaveTaxSettings: () => Promise<void>;
  isLoading: boolean;
  isSaving: boolean;
  emailConfirmed: boolean;
}

const TaxSettingsForm: React.FC<TaxSettingsFormProps> = ({
  taxData,
  handleTaxChange,
  handleTaxToggleChange,
  handleSaveTaxSettings,
  isLoading,
  isSaving,
  emailConfirmed
}) => {
  return (
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
  );
};

export default TaxSettingsForm;
