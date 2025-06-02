
import { useState, useEffect } from 'react';

export interface AccountSettings {
  first_name: string;
  last_name: string;
  email: string;
}

export interface BusinessSettings {
  company_name?: string;
  business_phone?: string;
  business_website?: string;
  business_address?: string;
  business_city?: string;
  business_state?: string;
  business_postal_code?: string;
  business_country?: string;
  default_currency?: string;
}

export interface InvoiceSettings {
  invoice_number_prefix?: string;
  invoice_number_format?: string;
  default_payment_terms?: string | number;
  default_notes?: string;
  auto_send_reminders?: boolean;
  invoice_prefix?: string;
  next_invoice_number?: number;
  auto_reminders?: boolean;
  notes_default?: string;
  terms_default?: string;
}

export interface TaxSettings {
  tax_number?: string;
  tax_rate?: number;
  tax_label?: string;
  apply_tax_by_default?: boolean;
  tax_enabled?: boolean;
  default_tax_rate?: number;
  tax_name?: string;
  tax_registration_number?: string;
}

export const useSettings = () => {
  const [accountSettings, setAccountSettings] = useState<AccountSettings>({
    first_name: '',
    last_name: '',
    email: '',
  });

  const [businessSettings, setBusinessSettings] = useState<BusinessSettings>({
    company_name: '',
    business_phone: '',
    business_website: '',
    business_address: '',
    business_city: '',
    business_state: '',
    business_postal_code: '',
    business_country: '',
    default_currency: 'usd',
  });

  const [invoiceSettings, setInvoiceSettings] = useState<InvoiceSettings>({
    invoice_number_prefix: 'INV',
    invoice_number_format: 'sequential',
    default_payment_terms: 30,
    default_notes: '',
    auto_send_reminders: false,
    invoice_prefix: 'INV-',
    next_invoice_number: 1001,
    auto_reminders: false,
    notes_default: '',
    terms_default: '',
  });

  const [taxSettings, setTaxSettings] = useState<TaxSettings>({
    tax_number: '',
    tax_rate: 0,
    tax_label: 'Tax',
    apply_tax_by_default: false,
    tax_enabled: false,
    default_tax_rate: 10,
    tax_name: 'Sales Tax',
    tax_registration_number: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Mock data for now - will be replaced with API calls
  useEffect(() => {
    // Load settings from localStorage or set defaults
    const savedAccountSettings = localStorage.getItem('accountSettings');
    const savedBusinessSettings = localStorage.getItem('businessSettings');
    const savedInvoiceSettings = localStorage.getItem('invoiceSettings');
    const savedTaxSettings = localStorage.getItem('taxSettings');

    if (savedAccountSettings) {
      setAccountSettings(JSON.parse(savedAccountSettings));
    }
    if (savedBusinessSettings) {
      setBusinessSettings(JSON.parse(savedBusinessSettings));
    }
    if (savedInvoiceSettings) {
      setInvoiceSettings(JSON.parse(savedInvoiceSettings));
    }
    if (savedTaxSettings) {
      setTaxSettings(JSON.parse(savedTaxSettings));
    }
  }, []);

  const saveAccountSettings = async (settings: AccountSettings) => {
    setIsSaving(true);
    try {
      localStorage.setItem('accountSettings', JSON.stringify(settings));
      setAccountSettings(settings);
      return true;
    } catch (error) {
      console.error('Error saving account settings:', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const saveBusinessSettings = async (settings: BusinessSettings) => {
    setIsSaving(true);
    try {
      localStorage.setItem('businessSettings', JSON.stringify(settings));
      setBusinessSettings(settings);
      return true;
    } catch (error) {
      console.error('Error saving business settings:', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const saveInvoiceSettings = async (settings: InvoiceSettings) => {
    setIsSaving(true);
    try {
      localStorage.setItem('invoiceSettings', JSON.stringify(settings));
      setInvoiceSettings(settings);
      return true;
    } catch (error) {
      console.error('Error saving invoice settings:', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const saveTaxSettings = async (settings: TaxSettings) => {
    setIsSaving(true);
    try {
      localStorage.setItem('taxSettings', JSON.stringify(settings));
      setTaxSettings(settings);
      return true;
    } catch (error) {
      console.error('Error saving tax settings:', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Additional methods expected by Settings page
  const updateBusinessSettings = async (settings: BusinessSettings) => {
    return await saveBusinessSettings(settings);
  };

  const updateAccountSettings = async (settings: AccountSettings) => {
    return await saveAccountSettings(settings);
  };

  const updateInvoiceSettings = async (settings: InvoiceSettings) => {
    return await saveInvoiceSettings(settings);
  };

  const updateTaxSettings = async (settings: TaxSettings) => {
    return await saveTaxSettings(settings);
  };

  const fetchUserProfile = async () => {
    // Mock implementation - replace with actual API call
    return accountSettings;
  };

  const fetchInvoiceSettings = async () => {
    // Mock implementation - replace with actual API call
    return invoiceSettings;
  };

  const fetchTaxSettings = async () => {
    // Mock implementation - replace with actual API call
    return taxSettings;
  };

  return {
    accountSettings,
    businessSettings,
    invoiceSettings,
    taxSettings,
    isLoading,
    isSaving,
    saveAccountSettings,
    saveBusinessSettings,
    saveInvoiceSettings,
    saveTaxSettings,
    updateBusinessSettings,
    updateAccountSettings,
    updateInvoiceSettings,
    updateTaxSettings,
    fetchUserProfile,
    fetchInvoiceSettings,
    fetchTaxSettings,
  };
};
