import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { useInvoices, Invoice } from '@/hooks/useInvoices';
import InvoiceView from '@/components/invoices/InvoiceView';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import InvoiceForm from '@/components/invoices/InvoiceForm';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { CreateInvoiceResponse } from '@/services/invoiceService';

const InvoiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { updateInvoice, deleteInvoice, sendInvoice, generatePDF, printInvoice, handleConfirmDelete, getInvoiceDetails } = useInvoices();
  const [isLoading, setIsLoading] = useState(true);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [rawInvoice, setRawInvoice] = useState<CreateInvoiceResponse | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadInvoice = async () => {
      if (!id) {
        console.error("No invoice ID provided");
        toast({
          title: "Error",
          description: "Invoice ID is missing. Redirecting to invoices page.",
          variant: "destructive",
        });
        navigate('/dashboard/invoices');
        return;
      }

      setIsLoading(true);
      try {
        console.log("Loading invoice with publicId:", id);
        
        const invoiceData = await getInvoiceDetails(id);
        setRawInvoice(invoiceData);
        
        // Convert to Invoice format for the InvoiceView component
        const convertedInvoice: Invoice = {
          id: invoiceData.publicId,
          date: invoiceData.date,
          dueDate: invoiceData.dueDate,
          customer: invoiceData.customer.name,
          email: invoiceData.customer.email,
          amount: invoiceData.total,
          status: invoiceData.status.toLowerCase() as Invoice['status'],
          description: invoiceData.notes,
          items: invoiceData.lines,
          notes: invoiceData.notes,
          invoice_number: invoiceData.invoiceNumber,
        };
        
        setInvoice(convertedInvoice);
      } catch (error) {
        console.error('Error loading invoice:', error);
        toast({
          title: "Error",
          description: "Failed to load invoice details",
          variant: "destructive",
        });
        navigate('/dashboard/invoices');
      } finally {
        setIsLoading(false);
      }
    };

    loadInvoice();
  }, [id, getInvoiceDetails, navigate, toast]);

  const handleGoBack = () => {
    navigate('/dashboard/invoices');
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
  };

  const handleConfirmDeleteLocal = async () => {
    if (!invoice) return;
    
    try {
      const success = await handleConfirmDelete(invoice.id);
      if (success) {
        navigate('/dashboard/invoices');
      }
    } catch (error) {
      console.error('Error deleting invoice:', error);
      toast({
        title: "Error",
        description: "Failed to delete invoice",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveEdit = async (updatedData: any) => {
    if (!invoice) return;
    
    try {
      await updateInvoice({
        ...invoice,
        ...updatedData,
        amount: updatedData.total, // Use total as the invoice amount
      });
      
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Invoice updated successfully",
      });
      // Re-fetch to get updated data
      fetchInvoices();
    } catch (error) {
      console.error('Error updating invoice:', error);
      toast({
        title: "Error",
        description: "Failed to update invoice",
        variant: "destructive",
      });
    }
  };

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!invoice || !rawInvoice) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-700">Invoice not found</h2>
            <button 
              onClick={() => navigate('/dashboard/invoices')}
              className="mt-4 text-primary hover:underline"
            >
              Go back to invoices
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <div className="container mx-auto px-4 py-8">
        <InvoiceView 
          invoice={invoice} 
          onBack={() => navigate('/dashboard/invoices')} 
          onEdit={() => setIsEditing(true)}
          onDelete={() => setIsDeleting(true)}
          onSend={(invoiceId) => sendInvoice(invoiceId)}
          onDownload={(invoiceId) => generatePDF(invoiceId)}
          onPrint={(invoiceId) => printInvoice(invoiceId)}
        />
      </div>

      {/* Edit Invoice Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Edit Invoice</DialogTitle>
          </DialogHeader>
          {invoice && (
            <InvoiceForm 
              invoice={invoice}
              onSave={async (updatedData) => {
                try {
                  await updateInvoice({
                    ...invoice,
                    ...updatedData,
                    amount: updatedData.total,
                  });
                  setIsEditing(false);
                  toast({
                    title: "Success",
                    description: "Invoice updated successfully",
                  });
                } catch (error) {
                  console.error('Error updating invoice:', error);
                  toast({
                    title: "Error",
                    description: "Failed to update invoice",
                    variant: "destructive",
                  });
                }
              }}
              onCancel={() => setIsEditing(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the invoice.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={async () => {
                if (!invoice) return;
                try {
                  const success = await handleConfirmDelete(invoice.id);
                  if (success) {
                    navigate('/dashboard/invoices');
                  }
                } catch (error) {
                  console.error('Error deleting invoice:', error);
                  toast({
                    title: "Error",
                    description: "Failed to delete invoice",
                    variant: "destructive",
                  });
                } finally {
                  setIsDeleting(false);
                }
              }} 
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default InvoiceDetail;
