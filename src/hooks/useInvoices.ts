
import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase/database';
import { useToast } from '@/hooks/use-toast';
import { useSettings } from '@/hooks/useSettings';

export interface Invoice {
  id: string;
  date: string;
  dueDate?: string;
  customer?: string;
  email?: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue' | 'draft' | 'unpaid';
  description?: string;
  items?: any[];
  notes?: string;
  invoice_number?: string;
  template_id?: string;
}

export const useInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const { invoiceSettings, refreshInvoiceSettings } = useSettings();

  const fetchInvoices = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Fetch invoices
      const { data: invoicesData, error: invoicesError } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (invoicesError) throw invoicesError;

      // Format the data to match our interface
      const formattedInvoices = invoicesData.map(invoice => ({
        id: invoice.id,
        invoice_number: invoice.invoice_number,
        template_id: invoice.invoice_template_id,
        date: invoice.date,
        dueDate: invoice.due_date || undefined,
        customer: invoice.customer || undefined,
        email: invoice.email || undefined,
        amount: invoice.amount,
        status: invoice.status,
        description: invoice.description || undefined,
        notes: invoice.notes || undefined,
        items: invoice.items || []
      }));

      setInvoices(formattedInvoices);
      console.log('Invoices loaded:', formattedInvoices.length);
    } catch (error) {
      console.error('Error loading invoices from Supabase:', error);
      toast({
        title: "Failed to load invoices",
        description: "There was a problem loading your invoice data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  // Fetch invoices on hook initialization
  useEffect(() => {
    if (user) {
      fetchInvoices();
    }
  }, [user, fetchInvoices]);

  const generateInvoiceNumber = useCallback(async () => {
    if (!invoiceSettings) {
      await refreshInvoiceSettings();
      return "INV-1001"; // Default fallback
    }

    const prefix = invoiceSettings.invoice_prefix || "INV-";
    const nextNumber = invoiceSettings.next_invoice_number || 1001;
    return `${prefix}${nextNumber}`;
  }, [invoiceSettings, refreshInvoiceSettings]);

  const incrementInvoiceNumber = useCallback(async () => {
    if (!user || !invoiceSettings) return;

    try {
      const nextNumber = (invoiceSettings.next_invoice_number || 1001) + 1;
      
      await supabase
        .from('invoice_settings')
        .update({ next_invoice_number: nextNumber })
        .eq('user_id', user.id);
      
      await refreshInvoiceSettings();
    } catch (error) {
      console.error('Error updating invoice number:', error);
    }
  }, [user, invoiceSettings, refreshInvoiceSettings]);

  const addInvoice = useCallback(async (invoice: Omit<Invoice, 'id'>) => {
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    try {
      // Generate invoice number
      const invoiceNumber = await generateInvoiceNumber();
      
      // Format the data for Supabase
      const supabaseInvoice = {
        user_id: user.id,
        invoice_number: invoiceNumber,
        invoice_template_id: invoice.template_id || null,
        date: invoice.date,
        due_date: invoice.dueDate || null,
        customer: invoice.customer || null,
        email: invoice.email || null,
        amount: invoice.amount,
        status: invoice.status,
        description: invoice.description || null,
        notes: invoice.notes || null,
        items: invoice.items || []
      };
      
      // Insert into Supabase
      const { data, error } = await supabase
        .from('invoices')
        .insert(supabaseInvoice)
        .select()
        .single();
      
      if (error) throw error;
      
      // Format the returned data
      const newInvoice: Invoice = {
        id: data.id,
        invoice_number: data.invoice_number,
        template_id: data.invoice_template_id,
        date: data.date,
        dueDate: data.due_date || undefined,
        customer: data.customer || undefined,
        email: data.email || undefined,
        amount: data.amount,
        status: data.status,
        description: data.description || undefined,
        notes: data.notes || undefined,
        items: data.items || []
      };
      
      // Update local state
      setInvoices(prev => [newInvoice, ...prev]);
      
      // Increment invoice number for next invoice
      await incrementInvoiceNumber();
      
      return newInvoice;
    } catch (error) {
      console.error('Error adding invoice:', error);
      toast({
        title: "Failed to add invoice",
        description: "There was a problem adding your invoice.",
        variant: "destructive",
      });
      throw error;
    }
  }, [user, toast, generateInvoiceNumber, incrementInvoiceNumber]);

  const updateInvoice = useCallback(async (updatedInvoice: Invoice) => {
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    try {
      // Format the data for Supabase
      const supabaseInvoice = {
        date: updatedInvoice.date,
        due_date: updatedInvoice.dueDate || null,
        customer: updatedInvoice.customer || null,
        email: updatedInvoice.email || null,
        amount: updatedInvoice.amount,
        status: updatedInvoice.status,
        description: updatedInvoice.description || null,
        notes: updatedInvoice.notes || null,
        items: updatedInvoice.items || [],
        invoice_template_id: updatedInvoice.template_id || null
      };
      
      // Update in Supabase
      const { error } = await supabase
        .from('invoices')
        .update(supabaseInvoice)
        .eq('id', updatedInvoice.id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Update local state
      setInvoices(prev => 
        prev.map(invoice => 
          invoice.id === updatedInvoice.id ? updatedInvoice : invoice
        )
      );
      
      toast({
        title: "Invoice updated",
        description: "Your invoice has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating invoice:', error);
      toast({
        title: "Failed to update invoice",
        description: "There was a problem updating your invoice.",
        variant: "destructive",
      });
      throw error;
    }
  }, [user, toast]);

  const deleteInvoice = useCallback(async (id: string) => {
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    try {
      // Delete from Supabase with RLS protection
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Update local state
      setInvoices(prev => prev.filter(invoice => invoice.id !== id));
      
      toast({
        title: "Invoice deleted",
        description: "Your invoice has been successfully deleted.",
      });
    } catch (error) {
      console.error('Error deleting invoice:', error);
      toast({
        title: "Failed to delete invoice",
        description: "There was a problem deleting your invoice.",
        variant: "destructive",
      });
      throw error;
    }
  }, [user, toast]);

  return {
    invoices,
    isLoading,
    fetchInvoices,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    generateInvoiceNumber
  };
};
