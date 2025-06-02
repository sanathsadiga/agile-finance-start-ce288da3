
import { useState, useEffect, useCallback } from 'react';
import { invoiceService, Invoice } from '@/services/invoiceService';
import { useToast } from '@/hooks/use-toast';

export type { Invoice } from '@/services/invoiceService';

export const useInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchInvoices = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await invoiceService.getInvoices();
      setInvoices(data);
      return data;
    } catch (error: any) {
      console.error('Error fetching invoices:', error);
      toast({
        title: 'Failed to load invoices',
        description: error.message || 'Could not load invoices',
        variant: 'destructive',
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const addInvoice = useCallback(async (invoice: Omit<Invoice, 'id'>) => {
    try {
      const newInvoice = await invoiceService.createInvoice(invoice);
      setInvoices(prev => [newInvoice, ...prev]);
      toast({
        title: 'Invoice created',
        description: 'Your invoice has been created successfully.',
      });
      return newInvoice;
    } catch (error: any) {
      toast({
        title: 'Failed to create invoice',
        description: error.message || 'Could not create invoice',
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast]);

  const updateInvoice = useCallback(async (updatedInvoice: Invoice) => {
    try {
      const updated = await invoiceService.updateInvoice(updatedInvoice.id, updatedInvoice);
      setInvoices(prev => 
        prev.map(invoice => 
          invoice.id === updatedInvoice.id ? updated : invoice
        )
      );
      toast({
        title: 'Invoice updated',
        description: 'Your invoice has been updated successfully.',
      });
      return updated;
    } catch (error: any) {
      toast({
        title: 'Failed to update invoice',
        description: error.message || 'Could not update invoice',
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast]);

  const deleteInvoice = useCallback(async (id: string) => {
    try {
      await invoiceService.deleteInvoice(id);
      setInvoices(prev => prev.filter(invoice => invoice.id !== id));
      toast({
        title: 'Invoice deleted',
        description: 'Your invoice has been deleted successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Failed to delete invoice',
        description: error.message || 'Could not delete invoice',
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast]);

  const getInvoice = useCallback(async (id: string) => {
    try {
      return await invoiceService.getInvoice(id);
    } catch (error: any) {
      toast({
        title: 'Failed to load invoice',
        description: error.message || 'Could not load invoice',
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast]);

  const sendInvoice = useCallback(async (id: string) => {
    try {
      await invoiceService.sendInvoice(id);
      toast({
        title: 'Invoice sent',
        description: 'Your invoice has been sent successfully.',
      });
      return true;
    } catch (error: any) {
      toast({
        title: 'Failed to send invoice',
        description: error.message || 'Could not send invoice',
        variant: 'destructive',
      });
      return false;
    }
  }, [toast]);

  const generatePDF = useCallback(async (id: string) => {
    try {
      const blob = await invoiceService.generatePDF(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: 'PDF generated',
        description: 'Your invoice PDF has been downloaded.',
      });
      return true;
    } catch (error: any) {
      toast({
        title: 'Failed to generate PDF',
        description: error.message || 'Could not generate PDF',
        variant: 'destructive',
      });
      return false;
    }
  }, [toast]);

  const printInvoice = useCallback((id: string) => {
    try {
      // Open a new window with the invoice for printing
      const printWindow = window.open(`/invoice/${id}/print`, '_blank');
      if (printWindow) {
        printWindow.focus();
        printWindow.print();
        return true;
      }
      return false;
    } catch (error: any) {
      toast({
        title: 'Failed to print invoice',
        description: error.message || 'Could not print invoice',
        variant: 'destructive',
      });
      return false;
    }
  }, [toast]);

  const handleConfirmDelete = useCallback(async (id: string) => {
    try {
      await deleteInvoice(id);
      return true;
    } catch (error) {
      console.error('Error deleting invoice:', error);
      return false;
    }
  }, [deleteInvoice]);

  return {
    invoices,
    isLoading,
    fetchInvoices,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    getInvoice,
    sendInvoice,
    generatePDF,
    printInvoice,
    handleConfirmDelete,
  };
};
