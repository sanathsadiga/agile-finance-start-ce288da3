
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useInvoices, Invoice } from './useInvoices';
import { useExpenses, Expense } from './useExpenses';
import { calculateFinancialMetrics } from '../utils/financialCalculations';

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

// Re-export types for backwards compatibility
export type { Invoice } from './useInvoices';
export type { Expense } from './useExpenses';

export const useSupabaseFinancialData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  // Use the separate hooks
  const { 
    invoices, 
    isLoading: invoicesLoading, 
    fetchInvoices,
    addInvoice,
    updateInvoice,
    deleteInvoice
  } = useInvoices();
  
  const { 
    expenses, 
    isLoading: expensesLoading,
    fetchExpenses,
    addExpense,
    updateExpense,
    deleteExpense
  } = useExpenses();

  // Effect to synchronize loading states
  useEffect(() => {
    if (!invoicesLoading && !expensesLoading) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [invoicesLoading, expensesLoading]);

  // Load data from Supabase
  useEffect(() => {
    if (!user) return;
    
    const loadData = async () => {
      try {
        await Promise.all([fetchInvoices(), fetchExpenses()]);
      } catch (error) {
        console.error('Error loading financial data:', error);
      }
    };

    loadData();
  }, [user, fetchInvoices, fetchExpenses]);

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
    calculateFinancialMetrics: calculateFinancialMetricsWrapper
  };
};
