
import React, { useEffect, useState } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileEdit, FileText, Plus } from 'lucide-react';
import { useInvoices, Invoice } from '@/hooks/useInvoices';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import InvoiceForm from '@/components/invoices/InvoiceForm';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useSettings } from '@/hooks/useSettings';

const Invoices = () => {
  const navigate = useNavigate();
  const { invoices, isLoading, fetchInvoices, addInvoice } = useInvoices();
  const { invoiceSettings, businessSettings } = useSettings();
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const handleCreateInvoice = async (invoiceData: any) => {
    try {
      const newInvoice = await addInvoice({
        ...invoiceData,
        amount: invoiceData.total, // Use total (which includes tax) as the invoice amount
      });
      setIsCreatingInvoice(false);
      toast({
        title: "Invoice created",
        description: "Your invoice has been created successfully.",
      });
      
      // Navigate to the new invoice
      if (newInvoice) {
        navigate(`/dashboard/invoices/${newInvoice.id}`);
      }
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast({
        title: "Failed to create invoice",
        description: "There was a problem creating your invoice.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500">Paid</Badge>;
      case 'unpaid':
        return <Badge className="bg-yellow-500">Unpaid</Badge>;
      case 'overdue':
        return <Badge className="bg-red-500">Overdue</Badge>;
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Format currency based on invoice's currency or user's default
  const formatCurrency = (amount: number, currencyCode: string = businessSettings?.default_currency || 'USD') => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    });
    return formatter.format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
            <p className="text-gray-600 mt-1">Create and manage your invoices</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0">
            <Button asChild variant="outline">
              <a href="/dashboard/templates" target="_blank" rel="noopener noreferrer">
                <FileEdit className="h-4 w-4 mr-2" />
                Manage Templates
              </a>
            </Button>
            <Button onClick={() => setIsCreatingInvoice(true)}>
              <FileText className="h-4 w-4 mr-2" />
              New Invoice
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : invoices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {invoices.map((invoice: Invoice) => (
              <Link 
                to={`/dashboard/invoices/${invoice.id}`} 
                key={invoice.id}
                className="block hover:no-underline"
              >
                <Card className="h-full transition-shadow hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">
                          {invoice.invoice_number || `INV-${invoice.id.substring(0, 6)}`}
                        </h3>
                        <p className="text-sm text-gray-500">{invoice.customer || 'No customer'}</p>
                      </div>
                      <div>
                        {getStatusBadge(invoice.status)}
                      </div>
                    </div>
                    <div className="mt-4 flex justify-between border-t pt-4">
                      <div className="text-sm text-gray-500">
                        {invoice.date ? format(new Date(invoice.date), 'MMM d, yyyy') : 'No date'}
                      </div>
                      <div className="font-bold">
                        {formatCurrency(invoice.amount, invoice.currency)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg border border-dashed border-gray-300">
            <Plus className="h-12 w-12 text-gray-400" />
            <p className="mt-4 text-gray-500">No invoices yet. Create your first invoice!</p>
          </div>
        )}
      </div>

      <Dialog open={isCreatingInvoice} onOpenChange={setIsCreatingInvoice}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Create New Invoice</DialogTitle>
          </DialogHeader>
          <InvoiceForm 
            onSave={handleCreateInvoice}
            onCancel={() => setIsCreatingInvoice(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Invoices;
