import { useState, useCallback, useEffect, useRef } from 'react';
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
  discount?: {
    type: 'percentage' | 'fixed';
    value: number;
    amount: number;
  };
  currency?: string; // Added currency field
}

export const useInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const { invoiceSettings, businessSettings, refreshInvoiceSettings, fetchInvoiceSettings } = useSettings();
  
  // Debounce fetch operations
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const shouldFetchRef = useRef<boolean>(true);
  const initialFetchDone = useRef<boolean>(false);

  // Initialize settings if needed
  useEffect(() => {
    if (user && !invoiceSettings && shouldFetchRef.current) {
      shouldFetchRef.current = false;
      fetchInvoiceSettings();
      
      // Reset the flag after a delay
      setTimeout(() => {
        shouldFetchRef.current = true;
      }, 5000);
    }
  }, [user, invoiceSettings, fetchInvoiceSettings]);

  const fetchInvoices = useCallback(async () => {
    if (!user) return [];
    
    // Prevent multiple simultaneous fetches
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }
    
    setIsLoading(true);
    try {
      console.log("Fetching invoices for user:", user.id);
      // Fetch invoices
      const { data: invoicesData, error: invoicesError } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (invoicesError) {
        console.error("Error fetching invoices:", invoicesError);
        throw invoicesError;
      }

      console.log("Raw invoices data:", invoicesData);

      // Format the data to match our interface
      const formattedInvoices = invoicesData.map(invoice => {
        console.log("Processing invoice:", invoice.id);
        return {
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
          items: invoice.items || [],
          discount: invoice.discount || undefined,
          currency: invoice.currency || undefined
        };
      });

      setInvoices(formattedInvoices);
      console.log('Invoices loaded:', formattedInvoices.length);
      console.log('Invoice IDs:', formattedInvoices.map(inv => inv.id));
      
      return formattedInvoices;
    } catch (error) {
      console.error('Error loading invoices from Supabase:', error);
      toast({
        title: "Failed to load invoices",
        description: "There was a problem loading your invoice data.",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
      initialFetchDone.current = true;
    }
  }, [user, toast]);

  // Fetch invoices on hook initialization
  useEffect(() => {
    if (user && !initialFetchDone.current) {
      fetchInvoices();
    }
    
    // Cleanup function
    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
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
      console.log('Adding invoice with data:', invoice);
      
      // Generate invoice number
      const invoiceNumber = await generateInvoiceNumber();
      
      // Get the user's currency preference from business settings
      const currency = businessSettings?.default_currency || 'USD';
      console.log('Using currency from business settings:', currency);
      
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
        items: invoice.items || [],
        discount: invoice.discount || null,
        // Use the currency from business settings
        currency: currency
      };
      
      console.log('Formatted for supabase:', supabaseInvoice);
      
      // Insert into Supabase, don't try to check for the currency column anymore
      const { data, error } = await supabase
        .from('invoices')
        .insert(supabaseInvoice)
        .select()
        .single();
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Invoice created:', data);
      
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
        items: data.items || [],
        discount: data.discount || undefined,
        currency: data.currency || currency // Use the currency from business settings as fallback
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
  }, [user, toast, generateInvoiceNumber, incrementInvoiceNumber, businessSettings]);

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
        invoice_template_id: updatedInvoice.template_id || null,
        discount: updatedInvoice.discount || null,
        currency: updatedInvoice.currency || businessSettings?.default_currency || 'USD'
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
      
      return updatedInvoice;
    } catch (error) {
      console.error('Error updating invoice:', error);
      toast({
        title: "Failed to update invoice",
        description: "There was a problem updating your invoice.",
        variant: "destructive",
      });
      throw error;
    }
  }, [user, toast, businessSettings]);

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

  // Send invoice via email
  const sendInvoice = useCallback(async (invoiceId: string) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const invoice = invoices.find(inv => inv.id === invoiceId);
      if (!invoice) {
        throw new Error('Invoice not found');
      }

      if (!invoice.email) {
        toast({
          title: "Email missing",
          description: "This invoice does not have a customer email address.",
          variant: "destructive",
        });
        return;
      }

      // In a real app, we would send an API request to a backend endpoint
      // For now, we'll just show a toast to simulate the email sending
      toast({
        title: "Invoice sent",
        description: `Invoice ${invoice.invoice_number} sent to ${invoice.email}`,
      });

      return true;
    } catch (error) {
      console.error('Error sending invoice:', error);
      toast({
        title: "Failed to send invoice",
        description: "There was a problem sending the invoice.",
        variant: "destructive",
      });
      return false;
    }
  }, [user, invoices, toast]);

  // Generate PDF for download (stub function for now)
  const generatePDF = useCallback(async (invoiceId: string) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const invoice = invoices.find(inv => inv.id === invoiceId);
      if (!invoice) {
        throw new Error('Invoice not found');
      }

      // In a real app, we would generate a PDF here
      // For now, we'll just show a toast
      toast({
        title: "PDF Generated",
        description: `Invoice ${invoice.invoice_number} PDF generated`,
      });

      // Simulate download by creating a window.print() call
      window.open(`/print-invoice/${invoiceId}`, '_blank');
      
      return true;
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Failed to generate PDF",
        description: "There was a problem generating the PDF.",
        variant: "destructive",
      });
      return false;
    }
  }, [user, invoices, toast]);

  // Print invoice
  const printInvoice = useCallback((invoiceId: string) => {
    try {
      const invoice = invoices.find(inv => inv.id === invoiceId);
      if (!invoice) {
        throw new Error('Invoice not found');
      }

      // Open a new window for printing
      window.print();
      
      return true;
    } catch (error) {
      console.error('Error printing invoice:', error);
      toast({
        title: "Failed to print",
        description: "There was a problem printing the invoice.",
        variant: "destructive",
      });
      return false;
    }
  }, [invoices, toast]);

  const handleSend = async (invoiceId: string) => {
    console.log("Sending invoice:", invoiceId);
    const result = await sendInvoice(invoiceId);
    if (!result) {
      toast({
        title: "Error",
        description: "Failed to send invoice",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async (invoiceId: string) => {
    console.log("Downloading invoice as PDF:", invoiceId);
    const result = await generatePDF(invoiceId);
    if (!result) {
      toast({
        title: "Error",
        description: "Failed to generate PDF",
        variant: "destructive",
      });
    }
  };

  const handlePrint = (invoiceId: string) => {
    console.log("Printing invoice:", invoiceId);
    const result = printInvoice(invoiceId);
    if (!result) {
      toast({
        title: "Error",
        description: "Failed to print invoice",
        variant: "destructive",
      });
    }
  };

  const handleConfirmDelete = async (invoiceId: string) => {
    if (!invoiceId) return;
    
    try {
      await deleteInvoice(invoiceId);
      navigate('/dashboard/invoices');
    } catch (error) {
      console.error('Error deleting invoice:', error);
    }
  };

  return {
    invoices,
    isLoading,
    fetchInvoices,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    sendInvoice,
    generatePDF,
    printInvoice,
    generateInvoiceNumber,
    handleSend,
    handleDownload,
    handlePrint,
    handleConfirmDelete
  };
};
