
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
  default_payment_terms?: string;
  default_notes?: string;
  auto_send_reminders?: boolean;
}

export interface TaxSettings {
  tax_number?: string;
  tax_rate?: number;
  tax_label?: string;
  apply_tax_by_default?: boolean;
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
    default_payment_terms: '30',
    default_notes: '',
    auto_send_reminders: false,
  });

  const [taxSettings, setTaxSettings] = useState<TaxSettings>({
    tax_number: '',
    tax_rate: 0,
    tax_label: 'Tax',
    apply_tax_by_default: false,
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
    } finally {
      setIsSaving(false);
    }
  };

  const saveBusinessSettings = async (settings: BusinessSettings) => {
    setIsSaving(true);
    try {
      localStorage.setItem('businessSettings', JSON.stringify(settings));
      setBusinessSettings(settings);
    } finally {
      setIsSaving(false);
    }
  };

  const saveInvoiceSettings = async (settings: InvoiceSettings) => {
    setIsSaving(true);
    try {
      localStorage.setItem('invoiceSettings', JSON.stringify(settings));
      setInvoiceSettings(settings);
    } finally {
      setIsSaving(false);
    }
  };

  const saveTaxSettings = async (settings: TaxSettings) => {
    setIsSaving(true);
    try {
      localStorage.setItem('taxSettings', JSON.stringify(settings));
      setTaxSettings(settings);
    } finally {
      setIsSaving(false);
    }
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
  };
};
