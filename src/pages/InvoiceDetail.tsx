
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { useInvoices, Invoice } from '@/hooks/useInvoices';
import InvoiceView from '@/components/invoices/InvoiceView';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import InvoiceForm from '@/components/invoices/InvoiceForm';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const InvoiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { invoices, fetchInvoices, updateInvoice, deleteInvoice, sendInvoice, generatePDF, printInvoice } = useInvoices();
  const [isLoading, setIsLoading] = useState(true);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadInvoice = async () => {
      setIsLoading(true);
      try {
        // First check if we already have the invoice in state
        if (invoices.length > 0) {
          const foundInvoice = invoices.find(inv => inv.id === id);
          if (foundInvoice) {
            setInvoice(foundInvoice);
            setIsLoading(false);
            return;
          }
        }

        // If not found, fetch invoices
        await fetchInvoices();
        
        // Now check if we have the invoice
        const foundInvoice = invoices.find(inv => inv.id === id);
        if (foundInvoice) {
          setInvoice(foundInvoice);
        } else {
          // Navigate back if invoice not found
          navigate('/dashboard/invoices');
        }
      } catch (error) {
        console.error('Error loading invoice:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInvoice();
  }, [id, invoices, fetchInvoices, navigate]);

  const handleGoBack = () => {
    navigate('/dashboard/invoices');
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
  };

  const handleConfirmDelete = async () => {
    if (!invoice) return;
    
    try {
      await deleteInvoice(invoice.id);
      navigate('/dashboard/invoices');
    } catch (error) {
      console.error('Error deleting invoice:', error);
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
      // Re-fetch to get updated data
      fetchInvoices();
    } catch (error) {
      console.error('Error updating invoice:', error);
    }
  };

  const handleSend = async (invoiceId: string) => {
    await sendInvoice(invoiceId);
  };

  const handleDownload = async (invoiceId: string) => {
    await generatePDF(invoiceId);
  };

  const handlePrint = (invoiceId: string) => {
    printInvoice(invoiceId);
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

  if (!invoice) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-700">Invoice not found</h2>
            <button 
              onClick={handleGoBack}
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
          onBack={handleGoBack} 
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSend={handleSend}
          onDownload={handleDownload}
          onPrint={handlePrint}
        />
      </div>

      {/* Edit Invoice Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Edit Invoice</DialogTitle>
          </DialogHeader>
          <InvoiceForm 
            invoice={invoice}
            onSave={handleSaveEdit}
            onCancel={() => setIsEditing(false)}
          />
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
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default InvoiceDetail;
