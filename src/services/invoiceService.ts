
import { api } from './api';

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
  currency?: string;
}

export const invoiceService = {
  // Get all invoices
  getInvoices: async (): Promise<Invoice[]> => {
    return api.get<Invoice[]>('/invoices');
  },

  // Get invoice by ID
  getInvoice: async (id: string): Promise<Invoice> => {
    return api.get<Invoice>(`/invoices/${id}`);
  },

  // Create new invoice
  createInvoice: async (invoice: Omit<Invoice, 'id'>): Promise<Invoice> => {
    return api.post<Invoice>('/invoices', invoice);
  },

  // Update invoice
  updateInvoice: async (id: string, invoice: Partial<Invoice>): Promise<Invoice> => {
    return api.put<Invoice>(`/invoices/${id}`, invoice);
  },

  // Delete invoice
  deleteInvoice: async (id: string): Promise<void> => {
    return api.delete(`/invoices/${id}`);
  },

  // Send invoice via email
  sendInvoice: async (id: string): Promise<void> => {
    return api.post(`/invoices/${id}/send`);
  },

  // Generate PDF
  generatePDF: async (id: string): Promise<Blob> => {
    const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8080/api'}/invoices/${id}/pdf`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
    return response.blob();
  },
};
