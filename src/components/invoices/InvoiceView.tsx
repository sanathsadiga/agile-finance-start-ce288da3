
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Printer, Download, Edit, Trash2, Send } from "lucide-react";
import { format } from 'date-fns';
import { Invoice } from '@/hooks/useInvoices';
import { useToast } from '@/hooks/use-toast';

interface InvoiceViewProps {
  invoice: Invoice;
  onBack: () => void;
  onEdit?: (invoiceId: string) => void;
  onDelete?: (invoiceId: string) => void;
  onSend?: (invoiceId: string) => void;
  onPrint?: (invoiceId: string) => void;
  onDownload?: (invoiceId: string) => void;
}

const InvoiceView: React.FC<InvoiceViewProps> = ({ 
  invoice, 
  onBack,
  onEdit,
  onDelete,
  onSend,
  onPrint,
  onDownload
}) => {
  const { toast } = useToast();

  const handleSend = () => {
    if (!invoice.email) {
      toast({
        title: "Email missing",
        description: "This invoice does not have a customer email address.",
        variant: "destructive",
      });
      return;
    }

    if (onSend) {
      onSend(invoice.id);
    } else {
      toast({
        title: "Send invoice",
        description: `Invoice would be sent to ${invoice.email}`,
      });
    }
  };

  const handlePrint = () => {
    if (onPrint) {
      onPrint(invoice.id);
    } else {
      window.print();
    }
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload(invoice.id);
    } else {
      toast({
        title: "Download PDF",
        description: "Invoice PDF would be downloaded",
      });
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(invoice.id);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(invoice.id);
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

  // Format currency based on invoice currency
  const formatCurrency = (amount: number) => {
    const currencyCode = invoice.currency || 'USD';
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    });
    return formatter.format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Invoices
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button size="sm" onClick={handleSend}>
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Invoice {invoice.invoice_number}</CardTitle>
          <div className="flex items-center gap-2">
            {getStatusBadge(invoice.status)}
            <Button variant="outline" size="sm" onClick={handleEdit}>
              <Edit className="h-3.5 w-3.5 mr-2" />
              Edit
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              <Trash2 className="h-3.5 w-3.5 mr-2" />
              Delete
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold mb-1">From</h3>
              <p className="text-sm">Your Business Name</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">To</h3>
              <p className="text-sm font-medium">{invoice.customer}</p>
              <p className="text-sm">{invoice.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-semibold mb-1">Invoice Date</h3>
              <p className="text-sm">
                {invoice.date ? format(new Date(invoice.date), 'MMM d, yyyy') : 'Not specified'}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">Due Date</h3>
              <p className="text-sm">
                {invoice.dueDate ? format(new Date(invoice.dueDate), 'MMM d, yyyy') : 'Not specified'}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">Amount Due</h3>
              <p className="text-lg font-bold">{formatCurrency(invoice.amount)}</p>
            </div>
          </div>

          <div className="border rounded-md overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-muted">
                  <th className="text-left p-3 text-xs font-medium">Description</th>
                  <th className="text-right p-3 text-xs font-medium">Quantity</th>
                  <th className="text-right p-3 text-xs font-medium">Price</th>
                  <th className="text-right p-3 text-xs font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items && invoice.items.length > 0 ? (
                  invoice.items.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-3">{item.description}</td>
                      <td className="p-3 text-right">{item.quantity}</td>
                      <td className="p-3 text-right">{formatCurrency(parseFloat(item.rate))}</td>
                      <td className="p-3 text-right">{formatCurrency(parseFloat(item.amount))}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-3 text-center text-muted-foreground">
                      No items
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <div className="w-full md:w-60">
              <div className="flex justify-between py-1">
                <span className="text-sm">Subtotal:</span>
                <span className="text-sm">{formatCurrency(invoice.amount)}</span>
              </div>
              
              {invoice.discount && (
                <div className="flex justify-between py-1">
                  <span className="text-sm">Discount:</span>
                  <span className="text-sm">-{formatCurrency(invoice.discount.amount)}</span>
                </div>
              )}

              <div className="flex justify-between py-1 font-medium border-t mt-2 pt-2">
                <span>Total:</span>
                <span>{formatCurrency(invoice.amount)}</span>
              </div>
            </div>
          </div>

          {invoice.notes && (
            <div>
              <h3 className="text-sm font-semibold mb-2">Notes</h3>
              <p className="text-sm bg-muted p-3 rounded-md">{invoice.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceView;
