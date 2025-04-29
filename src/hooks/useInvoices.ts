
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase/database';
import { useToast } from '@/hooks/use-toast';

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
}

export const useInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

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
        date: invoice.date,
        dueDate: invoice.due_date || undefined,
        customer: invoice.customer || undefined,
        email: invoice.email || undefined,
        amount: invoice.amount,
        status: invoice.status,
        description: invoice.description || undefined,
        notes: invoice.notes || undefined
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
  useCallback(() => {
    if (user) {
      fetchInvoices();
    }
  }, [user, fetchInvoices]);

  const addInvoice = useCallback(async (invoice: Omit<Invoice, 'id'>) => {
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    try {
      // Format the data for Supabase
      const supabaseInvoice = {
        user_id: user.id,
        date: invoice.date,
        due_date: invoice.dueDate || null,
        customer: invoice.customer || null,
        email: invoice.email || null,
        amount: invoice.amount,
        status: invoice.status,
        description: invoice.description || null,
        notes: invoice.notes || null
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
        date: data.date,
        dueDate: data.due_date || undefined,
        customer: data.customer || undefined,
        email: data.email || undefined,
        amount: data.amount,
        status: data.status,
        description: data.description || undefined,
        notes: data.notes || undefined
      };
      
      // Update local state
      setInvoices(prev => [newInvoice, ...prev]);
      
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
  }, [user, toast]);

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
        notes: updatedInvoice.notes || null
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
    deleteInvoice
  };
};
