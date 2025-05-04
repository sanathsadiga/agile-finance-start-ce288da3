
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { useInvoices, Invoice } from '@/hooks/useInvoices';
import InvoiceView from '@/components/invoices/InvoiceView';
import { Loader2 } from 'lucide-react';

const InvoiceDetail = () => {
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  const { invoices, isLoading, fetchInvoices } = useInvoices();
  const [invoice, setInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  useEffect(() => {
    if (!isLoading && invoices.length > 0 && invoiceId) {
      const foundInvoice = invoices.find(inv => inv.id === invoiceId);
      if (foundInvoice) {
        setInvoice(foundInvoice);
      } else {
        navigate('/dashboard/invoices');
      }
    }
  }, [invoices, invoiceId, isLoading, navigate]);

  const handleBack = () => {
    navigate('/dashboard/invoices');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : invoice ? (
          <InvoiceView invoice={invoice} onBack={handleBack} />
        ) : (
          <div className="flex justify-center py-12">
            <p>Invoice not found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceDetail;
