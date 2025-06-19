
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

export interface CreateInvoiceRequest {
  profileId: number;
  customerId: number;
  date: string;
  dueDate: string;
  notes?: string;
  lines: {
    description: string;
    quantity: number;
    unitPrice: number;
    taxRate: number;
  }[];
}

export interface CreateInvoiceResponse {
  publicId: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  status: string;
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  lines: {
    description: string;
    quantity: number;
    unitPrice: number;
    taxRate: number;
  }[];
  customer: {
    id: number | null;
    name: string;
    email: string;
    phone: string;
    address: string | null;
    createdByUserId: number | null;
    businessId: number | null;
  };
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

  // Create new invoice with backend integration
  createInvoice: async (invoiceData: CreateInvoiceRequest): Promise<CreateInvoiceResponse> => {
    return api.post<CreateInvoiceResponse>('/api/invoices', invoiceData);
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
