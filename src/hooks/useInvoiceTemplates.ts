import { useState, useCallback, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase/database';
import { useToast } from '@/hooks/use-toast';

export interface LayoutConfig {
  header: boolean;
  businessInfo: boolean;
  clientInfo: boolean;
  invoiceInfo: boolean;
  itemTable: boolean;
  summary: boolean;
  notes: boolean;
  footer: boolean;
  logo?: boolean;
  discounts?: boolean;
}

export interface StyleConfig {
  fontFamily: string;
  fontSize: string;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  borderStyle: string;
  headerAlignment: 'left' | 'center' | 'right';
  logoPosition: 'left' | 'center' | 'right';
  tableStyle: 'bordered' | 'borderless' | 'striped';
}

export interface ContentConfig {
  headerText: string;
  footerText: string;
  notesLabel: string;
  termsLabel: string;
  discountLabel?: string;
}

export interface InvoiceTemplate {
  id: string;
  name: string;
  is_default: boolean;
  layout_config: LayoutConfig;
  style_config: StyleConfig;
  content_config: ContentConfig;
  logo?: string | null;
  created_at: string;
  updated_at: string;
}

export const useInvoiceTemplates = () => {
  const [templates, setTemplates] = useState<InvoiceTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Debounce fetch operations
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isFetchingRef = useRef<boolean>(false);

  // Default template configs
  const defaultLayoutConfig: LayoutConfig = {
    header: true,
    businessInfo: true,
    clientInfo: true,
    invoiceInfo: true,
    itemTable: true,
    summary: true,
    notes: true,
    footer: true,
    logo: true,
    discounts: true
  };

  const defaultStyleConfig: StyleConfig = {
    fontFamily: 'Inter, sans-serif',
    fontSize: '16px',
    primaryColor: '#6366f1',
    secondaryColor: '#f3f4f6',
    textColor: '#111827',
    borderStyle: '1px solid #e5e7eb',
    headerAlignment: 'left',
    logoPosition: 'left',
    tableStyle: 'bordered'
  };

  const defaultContentConfig: ContentConfig = {
    headerText: 'INVOICE',
    footerText: 'Thank you for your business',
    notesLabel: 'Notes',
    termsLabel: 'Terms & Conditions',
    discountLabel: 'Discount'
  };

  const fetchTemplates = useCallback(async () => {
    if (!user) return;
    
    // Prevent concurrent fetches
    if (isFetchingRef.current) {
      console.log('Templates: Already fetching templates, skipping duplicate request');
      return;
    }
    
    // Clear any pending fetch operations
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }
    
    // Debounce the fetch operation
    fetchTimeoutRef.current = setTimeout(async () => {
      try {
        console.log('Templates: Starting fetch operation');
        isFetchingRef.current = true;
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('invoice_templates')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;

        console.log('Templates: Fetch completed successfully, found', data.length, 'templates');

        // Ensure default configs are properly formatted
        const formattedTemplates: InvoiceTemplate[] = data.map(template => ({
          ...template,
          layout_config: {
            ...defaultLayoutConfig,
            ...template.layout_config
          },
          style_config: {
            ...defaultStyleConfig,
            ...template.style_config
          },
          content_config: {
            ...defaultContentConfig,
            ...template.content_config
          }
        }));

        setTemplates(formattedTemplates);
      } catch (error) {
        console.error('Error fetching invoice templates:', error);
        toast({
          title: 'Failed to load templates',
          description: 'Could not load your invoice templates.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
        isFetchingRef.current = false;
        fetchTimeoutRef.current = null;
        console.log('Templates: Fetch operation completed');
      }
    }, 300);
  }, [user, toast]);

  const addTemplate = useCallback(async (name: string) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      console.log('Templates: Creating new template:', name);
      const newTemplate = {
        user_id: user.id,
        name,
        is_default: templates.length === 0, // First template is default
        layout_config: defaultLayoutConfig,
        style_config: defaultStyleConfig,
        content_config: defaultContentConfig
      };

      const { data, error } = await supabase
        .from('invoice_templates')
        .insert(newTemplate)
        .select()
        .single();

      if (error) throw error;

      console.log('Templates: Template created successfully:', data);
      
      // Update local state
      const createdTemplate = {
        ...data,
        layout_config: {
          ...defaultLayoutConfig,
          ...data.layout_config
        },
        style_config: {
          ...defaultStyleConfig,
          ...data.style_config
        },
        content_config: {
          ...defaultContentConfig,
          ...data.content_config
        }
      } as InvoiceTemplate;
      
      setTemplates(prev => [...prev, createdTemplate]);
      
      toast({
        title: 'Template created',
        description: `"${name}" template has been created.`,
      });
      
      return createdTemplate;
    } catch (error) {
      console.error('Error creating template:', error);
      toast({
        title: 'Failed to create template',
        description: 'Could not create your invoice template.',
        variant: 'destructive',
      });
      throw error;
    }
  }, [user, templates, toast]);

  const updateTemplate = useCallback(async (
    templateId: string, 
    updates: Partial<Omit<InvoiceTemplate, 'id' | 'created_at' | 'updated_at'>>
  ) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      // Handle logo separately if it's oversized
      let updatesToSave = { ...updates };
      
      // Store the logo separately if it's too large
      const logoData = updates.logo;
      
      // If logo is very large, we might need to handle it differently
      // but for now we're keeping it simple
      
      const { error } = await supabase
        .from('invoice_templates')
        .update(updatesToSave)
        .eq('id', templateId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update templates in state
      setTemplates(prev => 
        prev.map(template => 
          template.id === templateId 
            ? { ...template, ...updates } 
            : template
        )
      );

      toast({
        title: 'Template updated',
        description: 'Your invoice template has been updated.',
      });
    } catch (error) {
      console.error('Error updating template:', error);
      toast({
        title: 'Failed to update template',
        description: 'Could not update your invoice template.',
        variant: 'destructive',
      });
      throw error;
    }
  }, [user, toast]);

  const setDefaultTemplate = useCallback(async (templateId: string) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      // First, clear default status for all templates
      await supabase
        .from('invoice_templates')
        .update({ is_default: false })
        .eq('user_id', user.id);

      // Then set the selected template as default
      const { error } = await supabase
        .from('invoice_templates')
        .update({ is_default: true })
        .eq('id', templateId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update templates in state
      setTemplates(prev => 
        prev.map(template => ({
          ...template,
          is_default: template.id === templateId
        }))
      );

      toast({
        title: 'Default template set',
        description: 'Your default invoice template has been updated.',
      });
    } catch (error) {
      console.error('Error setting default template:', error);
      toast({
        title: 'Failed to set default template',
        description: 'Could not update your default invoice template.',
        variant: 'destructive',
      });
      throw error;
    }
  }, [user, toast]);

  const deleteTemplate = useCallback(async (templateId: string) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      // Check if it's the default template
      const templateToDelete = templates.find(t => t.id === templateId);
      if (!templateToDelete) throw new Error('Template not found');

      if (templateToDelete.is_default) {
        throw new Error('Cannot delete default template');
      }

      const { error } = await supabase
        .from('invoice_templates')
        .delete()
        .eq('id', templateId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Remove template from state
      setTemplates(prev => prev.filter(template => template.id !== templateId));

      toast({
        title: 'Template deleted',
        description: 'Your invoice template has been deleted.',
      });
    } catch (error: any) {
      console.error('Error deleting template:', error);
      toast({
        title: 'Failed to delete template',
        description: error.message || 'Could not delete your invoice template.',
        variant: 'destructive',
      });
      throw error;
    }
  }, [user, templates, toast]);

  const duplicateTemplate = useCallback(async (templateId: string) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const templateToCopy = templates.find(t => t.id === templateId);
      if (!templateToCopy) throw new Error('Template not found');

      const newTemplate = {
        user_id: user.id,
        name: `${templateToCopy.name} (Copy)`,
        is_default: false,
        layout_config: templateToCopy.layout_config,
        style_config: templateToCopy.style_config,
        content_config: templateToCopy.content_config
      };

      const { data, error } = await supabase
        .from('invoice_templates')
        .insert(newTemplate)
        .select()
        .single();

      if (error) throw error;

      setTemplates(prev => [...prev, data as InvoiceTemplate]);
      
      toast({
        title: 'Template duplicated',
        description: `"${templateToCopy.name}" has been duplicated.`,
      });
      
      return data;
    } catch (error) {
      console.error('Error duplicating template:', error);
      toast({
        title: 'Failed to duplicate template',
        description: 'Could not duplicate your invoice template.',
        variant: 'destructive',
      });
      throw error;
    }
  }, [user, templates, toast]);

  // Load templates on component mount or when user changes
  useEffect(() => {
    if (user) {
      console.log('Templates: User is authenticated, fetching templates');
      fetchTemplates();
    } else {
      console.log('Templates: No authenticated user, clearing templates');
      setTemplates([]);
      setIsLoading(false);
    }
    
    // Cleanup function
    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, [user, fetchTemplates]);

  return {
    templates,
    isLoading,
    fetchTemplates,
    addTemplate,
    updateTemplate,
    setDefaultTemplate,
    deleteTemplate,
    duplicateTemplate,
    // Helper to get default template
    getDefaultTemplate: useCallback(() => {
      return templates.find(template => template.is_default) || templates[0];
    }, [templates])
  };
};
