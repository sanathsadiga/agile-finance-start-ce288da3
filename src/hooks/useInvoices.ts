import { useState, useEffect, useCallback } from 'react';
import { invoiceService, Invoice, CreateInvoiceRequest, CreateInvoiceResponse } from '@/services/invoiceService';
import { useToast } from '@/hooks/use-toast';
import { useBusinessProfile } from '@/hooks/useBusinessProfile';

export type { Invoice } from '@/services/invoiceService';

// Helper function to convert CreateInvoiceResponse to Invoice format
const convertResponseToInvoice = (response: CreateInvoiceResponse): Invoice => {
  return {
    id: response.publicId,
    date: response.date,
    dueDate: response.dueDate,
    customer: response.customer.name,
    email: response.customer.email,
    amount: response.total,
    status: response.status.toLowerCase() as Invoice['status'],
    description: response.notes,
    items: response.lines,
    notes: response.notes,
    invoice_number: response.invoiceNumber,
  };
};

export const useInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [rawInvoices, setRawInvoices] = useState<CreateInvoiceResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<CreateInvoiceResponse | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();
  const { profileId } = useBusinessProfile();

  const fetchInvoices = useCallback(async () => {
    try {
      setIsLoading(true);
      
      if (profileId) {
        // Fetch invoices by profile ID
        const rawData = await invoiceService.getInvoicesByProfile(profileId);
        setRawInvoices(rawData);
        const convertedData = rawData.map(convertResponseToInvoice);
        setInvoices(convertedData);
        return convertedData;
      } else {
        // Fallback to old method if no profile ID
        const data = await invoiceService.getInvoices();
        setInvoices(data);
        return data;
      }
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
  }, [toast, profileId]);

  const searchInvoice = useCallback(async (invoiceNumber: string) => {
    if (!invoiceNumber.trim()) {
      setSearchResults(null);
      return;
    }

    try {
      setIsSearching(true);
      const result = await invoiceService.searchInvoiceByNumber(invoiceNumber);
      setSearchResults(result);
    } catch (error: any) {
      console.error('Error searching invoice:', error);
      setSearchResults(null);
      toast({
        title: 'Invoice not found',
        description: error.message || 'Could not find invoice with that number',
        variant: 'destructive',
      });
    } finally {
      setIsSearching(false);
    }
  }, [toast]);

  const clearSearch = useCallback(() => {
    setSearchResults(null);
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const addInvoice = useCallback(async (invoiceData: CreateInvoiceRequest) => {
    try {
      const response = await invoiceService.createInvoice(invoiceData);
      const newInvoice = convertResponseToInvoice(response);
      setInvoices(prev => [newInvoice, ...prev]);
      setRawInvoices(prev => [response, ...prev]);
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

  const getInvoiceDetails = useCallback(async (publicId: string) => {
    try {
      return await invoiceService.getInvoice(publicId);
    } catch (error: any) {
      toast({
        title: 'Failed to load invoice',
        description: error.message || 'Could not load invoice details',
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast]);

  return {
    invoices,
    rawInvoices,
    isLoading,
    searchResults,
    isSearching,
    fetchInvoices,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    getInvoice,
    sendInvoice,
    generatePDF,
    printInvoice,
    handleConfirmDelete,
    getInvoiceDetails,
    searchInvoice,
    clearSearch,
  };
};
