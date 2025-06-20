
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Calendar, User, Mail, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { invoiceService, CreateInvoiceResponse } from '@/services/invoiceService';
import { paymentService, RazorpayResponse } from '@/services/paymentService';
import { format } from 'date-fns';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const InvoicePayment = () => {
  const { publicId } = useParams<{ publicId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [invoice, setInvoice] = useState<CreateInvoiceResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    if (publicId) {
      loadInvoice();
      loadRazorpayScript();
    }
  }, [publicId]);

  const loadRazorpayScript = () => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  };

  const loadInvoice = async () => {
    try {
      setIsLoading(true);
      if (!publicId) return;
      
      const invoiceData = await invoiceService.getInvoice(publicId);
      setInvoice(invoiceData);
    } catch (error: any) {
      console.error('Error loading invoice:', error);
      toast({
        title: 'Error loading invoice',
        description: error.message || 'Could not load invoice details',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateLineTotal = (quantity: number, unitPrice: number, taxRate: number) => {
    const subtotal = quantity * unitPrice;
    const tax = (subtotal * taxRate) / 100;
    return subtotal + tax;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const handlePayNow = async () => {
    if (!publicId || !invoice) return;

    try {
      setIsProcessingPayment(true);
      
      // Create Razorpay order
      const orderData = await paymentService.createOrder(publicId);
      
      if (!window.Razorpay) {
        toast({
          title: 'Payment system not ready',
          description: 'Please refresh the page and try again',
          variant: 'destructive',
        });
        return;
      }

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Invoice Payment',
        description: `Payment for ${invoice.invoiceNumber}`,
        order_id: orderData.razorpayOrderId,
        handler: async function (response: RazorpayResponse) {
          try {
            const payload = {
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
              publicId: publicId!,
            };
            
            await paymentService.confirmPayment(payload);
            navigate('/payment-success');
          } catch (error: any) {
            console.error('Payment confirmation failed:', error);
            navigate('/payment-failed');
          }
        },
        prefill: {
          name: orderData.customer.name,
          email: orderData.customer.email,
          contact: orderData.customer.contact,
        },
        theme: { 
          color: '#0d6efd' 
        },
        modal: {
          ondismiss: function() {
            setIsProcessingPayment(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error('Payment initiation failed:', error);
      toast({
        title: 'Payment failed',
        description: error.message || 'Could not initiate payment',
        variant: 'destructive',
      });
      setIsProcessingPayment(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Invoice Not Found</h2>
            <p className="text-gray-600">The requested invoice could not be found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Invoice Payment</h1>
          <p className="text-gray-600 mt-2">Complete your payment securely</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              {invoice.invoiceNumber}
              <Badge variant={invoice.status === 'PAID' ? 'default' : 'secondary'}>
                {invoice.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Invoice Details</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Date:</span>
                    <span>{format(new Date(invoice.date), 'MMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Due Date:</span>
                    <span>{format(new Date(invoice.dueDate), 'MMM d, yyyy')}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Customer Details</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-gray-500" />
                    <span>{invoice.customer.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span>{invoice.customer.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{invoice.customer.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Line Items</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Qty × Price</TableHead>
                    <TableHead className="text-right">Tax</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice.lines.map((line, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{line.description}</TableCell>
                      <TableCell className="text-right">
                        {line.quantity} × {formatCurrency(line.unitPrice)}
                      </TableCell>
                      <TableCell className="text-right">{line.taxRate}%</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(calculateLineTotal(line.quantity, line.unitPrice, line.taxRate))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="border-t pt-4">
              <div className="flex flex-col gap-2 max-w-xs ml-auto">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span>{formatCurrency(invoice.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax:</span>
                  <span>{formatCurrency(invoice.tax)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total:</span>
                  <span>{formatCurrency(invoice.total)}</span>
                </div>
              </div>
            </div>

            {invoice.notes && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Notes:</span> {invoice.notes}
                </p>
              </div>
            )}

            <div className="mt-6 text-center">
              {invoice.status === 'PAID' ? (
                <Badge variant="default" className="text-lg px-6 py-2">
                  Already Paid
                </Badge>
              ) : (
                <Button 
                  onClick={handlePayNow}
                  disabled={isProcessingPayment}
                  className="px-8 py-3 text-lg"
                  size="lg"
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  {isProcessingPayment ? 'Processing...' : `Pay ${formatCurrency(invoice.total)}`}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InvoicePayment;
