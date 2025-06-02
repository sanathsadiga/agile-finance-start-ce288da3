
import { useState, useEffect } from 'react';

export interface InvoiceTemplate {
  id: string;
  name: string;
  description?: string;
  is_default: boolean;
  styles: {
    fontFamily: string;
    fontSize: string;
    primaryColor: string;
    secondaryColor: string;
    textColor: string;
    headerAlignment: string;
    logoPosition: string;
    tableStyle: string;
    borderStyle?: string;
  };
  layout: {
    showLogo: boolean;
    showCompanyInfo: boolean;
    showBillTo: boolean;
    showDates: boolean;
    showItemTable: boolean;
    showNotes: boolean;
    showTerms: boolean;
  };
  created_at?: string;
  updated_at?: string;
}

export const useInvoiceTemplates = () => {
  const [templates, setTemplates] = useState<InvoiceTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTemplate, setCurrentTemplate] = useState<InvoiceTemplate>({
    id: '',
    name: '',
    is_default: false,
    styles: {
      fontFamily: 'Inter',
      fontSize: '14px',
      primaryColor: '#000000',
      secondaryColor: '#666666',
      textColor: '#000000',
      headerAlignment: 'left',
      logoPosition: 'left',
      tableStyle: 'modern',
      borderStyle: 'solid',
    },
    layout: {
      showLogo: true,
      showCompanyInfo: true,
      showBillTo: true,
      showDates: true,
      showItemTable: true,
      showNotes: true,
      showTerms: true,
    },
  });

  // Load templates on mount
  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setIsLoading(true);
    try {
      // Mock templates for now - replace with API call
      const mockTemplates: InvoiceTemplate[] = [
        {
          id: '1',
          name: 'Modern',
          description: 'Clean and modern template',
          is_default: true,
          styles: {
            fontFamily: 'Inter',
            fontSize: '14px',
            primaryColor: '#000000',
            secondaryColor: '#666666',
            textColor: '#000000',
            headerAlignment: 'left',
            logoPosition: 'left',
            tableStyle: 'modern',
            borderStyle: 'solid',
          },
          layout: {
            showLogo: true,
            showCompanyInfo: true,
            showBillTo: true,
            showDates: true,
            showItemTable: true,
            showNotes: true,
            showTerms: true,
          },
        },
      ];
      
      setTemplates(mockTemplates);
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addTemplate = async (template: Omit<InvoiceTemplate, 'id'>) => {
    try {
      const newTemplate = {
        ...template,
        id: Date.now().toString(),
      };
      setTemplates(prev => [...prev, newTemplate]);
      return newTemplate;
    } catch (error) {
      console.error('Error adding template:', error);
      throw error;
    }
  };

  const updateTemplate = async (id: string, template: Partial<InvoiceTemplate>) => {
    try {
      setTemplates(prev => 
        prev.map(t => t.id === id ? { ...t, ...template } : t)
      );
    } catch (error) {
      console.error('Error updating template:', error);
      throw error;
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      setTemplates(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting template:', error);
      throw error;
    }
  };

  const setDefaultTemplate = async (id: string) => {
    try {
      setTemplates(prev => 
        prev.map(t => ({ ...t, is_default: t.id === id }))
      );
    } catch (error) {
      console.error('Error setting default template:', error);
      throw error;
    }
  };

  const getDefaultTemplate = () => {
    return templates.find(t => t.is_default) || templates[0];
  };

  const fetchTemplates = async () => {
    return loadTemplates();
  };

  return {
    templates,
    isLoading,
    currentTemplate,
    setCurrentTemplate,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    setDefaultTemplate,
    getDefaultTemplate,
    fetchTemplates,
  };
};
