
import { useState, useEffect } from 'react';

export interface InvoiceTemplate {
  id: string;
  name: string;
  is_default: boolean;
  style_config: {
    fontFamily: string;
    fontSize: string;
    primaryColor: string;
    secondaryColor: string;
    textColor: string;
    headerAlignment: string;
    logoPosition: string;
    tableStyle: string;
  };
  content_config: {
    headerText: string;
    footerText: string;
    notesLabel: string;
    termsLabel: string;
    discountLabel: string;
  };
  layout_config: {
    header: boolean;
    logo: boolean;
    businessInfo: boolean;
    clientInfo: boolean;
    invoiceInfo: boolean;
    itemTable: boolean;
    summary: boolean;
    discounts: boolean;
    notes: boolean;
    footer: boolean;
  };
  logo?: string;
  created_at: string;
  updated_at: string;
}

export const useInvoiceTemplates = () => {
  const [templates, setTemplates] = useState<InvoiceTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<InvoiceTemplate | null>(null);

  // Mock default template
  const defaultTemplate: InvoiceTemplate = {
    id: 'default',
    name: 'Default Template',
    is_default: true,
    style_config: {
      fontFamily: 'Inter',
      fontSize: '14px',
      primaryColor: '#9b87f5',
      secondaryColor: '#f3f4f6',
      textColor: '#1f2937',
      headerAlignment: 'left',
      logoPosition: 'left',
      tableStyle: 'bordered',
    },
    content_config: {
      headerText: 'INVOICE',
      footerText: 'Thank you for your business!',
      notesLabel: 'Notes',
      termsLabel: 'Terms & Conditions',
      discountLabel: 'Discount',
    },
    layout_config: {
      header: true,
      logo: true,
      businessInfo: true,
      clientInfo: true,
      invoiceInfo: true,
      itemTable: true,
      summary: true,
      discounts: true,
      notes: true,
      footer: true,
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  useEffect(() => {
    // Load templates from localStorage or set default
    const savedTemplates = localStorage.getItem('invoiceTemplates');
    if (savedTemplates) {
      setTemplates(JSON.parse(savedTemplates));
    } else {
      setTemplates([defaultTemplate]);
    }
  }, []);

  const saveTemplate = async (template: InvoiceTemplate) => {
    const updatedTemplates = templates.map(t => 
      t.id === template.id ? template : t
    );
    setTemplates(updatedTemplates);
    localStorage.setItem('invoiceTemplates', JSON.stringify(updatedTemplates));
  };

  const createTemplate = async (template: Omit<InvoiceTemplate, 'id' | 'created_at' | 'updated_at'>) => {
    const newTemplate: InvoiceTemplate = {
      ...template,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    const updatedTemplates = [...templates, newTemplate];
    setTemplates(updatedTemplates);
    localStorage.setItem('invoiceTemplates', JSON.stringify(updatedTemplates));
    return newTemplate;
  };

  const deleteTemplate = async (id: string) => {
    const updatedTemplates = templates.filter(t => t.id !== id);
    setTemplates(updatedTemplates);
    localStorage.setItem('invoiceTemplates', JSON.stringify(updatedTemplates));
  };

  const setDefaultTemplate = async (id: string) => {
    const updatedTemplates = templates.map(t => ({
      ...t,
      is_default: t.id === id
    }));
    setTemplates(updatedTemplates);
    localStorage.setItem('invoiceTemplates', JSON.stringify(updatedTemplates));
  };

  const duplicateTemplate = async (id: string) => {
    const originalTemplate = templates.find(t => t.id === id);
    if (originalTemplate) {
      const duplicatedTemplate: InvoiceTemplate = {
        ...originalTemplate,
        id: Date.now().toString(),
        name: `${originalTemplate.name} (Copy)`,
        is_default: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      const updatedTemplates = [...templates, duplicatedTemplate];
      setTemplates(updatedTemplates);
      localStorage.setItem('invoiceTemplates', JSON.stringify(updatedTemplates));
    }
  };

  const getDefaultTemplate = () => {
    return templates.find(t => t.is_default) || defaultTemplate;
  };

  return {
    templates,
    isLoading,
    currentTemplate,
    setCurrentTemplate,
    saveTemplate,
    createTemplate,
    deleteTemplate,
    setDefaultTemplate,
    duplicateTemplate,
    getDefaultTemplate,
  };
};
