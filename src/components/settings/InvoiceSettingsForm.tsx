
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { InvoiceSettings } from "@/hooks/useSettings";

interface InvoiceSettingsFormProps {
  invoiceData: InvoiceSettings;
  handleInvoiceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleInvoiceSelectChange: (field: string, value: any) => void;
  handleInvoiceToggleChange: (field: string, checked: boolean) => void;
  handleSaveInvoiceSettings: () => Promise<void>;
  isLoading: boolean;
  isSaving: boolean;
  emailConfirmed: boolean;
}

const InvoiceSettingsForm: React.FC<InvoiceSettingsFormProps> = ({
  invoiceData,
  handleInvoiceChange,
  handleInvoiceSelectChange,
  handleInvoiceToggleChange,
  handleSaveInvoiceSettings,
  isLoading,
  isSaving,
  emailConfirmed
}) => {
  return (
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
  );
};

export default InvoiceSettingsForm;
