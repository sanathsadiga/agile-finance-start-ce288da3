import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { invoiceService, Invoice, CreateInvoiceRequest, CreateInvoiceResponse } from '@/services/invoiceService';
import { expenseService, Expense } from '@/services/expenseService';
import { calculateFinancialMetrics } from '../utils/financialCalculations';
import { useToast } from '@/hooks/use-toast';

export interface MonthlyData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface FinancialSummary {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  outstandingInvoices: number;
}

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

export const useApiFinancialData = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load data from API
  const fetchData = useCallback(async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const [invoicesData, expensesData] = await Promise.all([
        invoiceService.getInvoices(),
        expenseService.getExpenses(),
      ]);
      
      setInvoices(invoicesData);
      setExpenses(expensesData);
    } catch (error: any) {
      console.error('Error loading financial data:', error);
      toast({
        title: 'Failed to load data',
        description: error.message || 'Could not load financial data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Invoice operations
  const addInvoice = useCallback(async (invoiceData: CreateInvoiceRequest) => {
    try {
      const response = await invoiceService.createInvoice(invoiceData);
      const newInvoice = convertResponseToInvoice(response);
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

  // Expense operations
  const addExpense = useCallback(async (expense: Omit<Expense, 'id'>) => {
    try {
      const newExpense = await expenseService.createExpense(expense);
      setExpenses(prev => [newExpense, ...prev]);
      toast({
        title: 'Expense added',
        description: 'Your expense has been added successfully.',
      });
      return newExpense;
    } catch (error: any) {
      toast({
        title: 'Failed to add expense',
        description: error.message || 'Could not add expense',
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast]);

  const updateExpense = useCallback(async (updatedExpense: Expense) => {
    try {
      const updated = await expenseService.updateExpense(updatedExpense.id, updatedExpense);
      setExpenses(prev => 
        prev.map(expense => 
          expense.id === updatedExpense.id ? updated : expense
        )
      );
      toast({
        title: 'Expense updated',
        description: 'Your expense has been updated successfully.',
      });
      return updated;
    } catch (error: any) {
      toast({
        title: 'Failed to update expense',
        description: error.message || 'Could not update expense',
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast]);

  const deleteExpense = useCallback(async (id: string) => {
    try {
      await expenseService.deleteExpense(id);
      setExpenses(prev => prev.filter(expense => expense.id !== id));
      toast({
        title: 'Expense deleted',
        description: 'Your expense has been deleted successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Failed to delete expense',
        description: error.message || 'Could not delete expense',
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast]);

  const calculateFinancialMetricsWrapper = useCallback(() => {
    return calculateFinancialMetrics(invoices, expenses);
  }, [invoices, expenses]);

  return {
    invoices,
    expenses,
    isLoading,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    addExpense,
    updateExpense,
    deleteExpense,
    calculateFinancialMetrics: calculateFinancialMetricsWrapper,
    refreshData: fetchData,
  };
};
