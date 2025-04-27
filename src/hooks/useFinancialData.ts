
import { useState, useEffect, useCallback } from 'react';

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
}

export interface Expense {
  id: string;
  date: string;
  amount: number;
  category: string;
  description: string;
  vendor?: string;
  receipt?: boolean;
  notes?: string;
}

interface MonthlyData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

interface FinancialSummary {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  outstandingInvoices: number;
}

export const useFinancialData = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    try {
      const storedInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');
      const storedExpenses = JSON.parse(localStorage.getItem('expenses') || '[]');
      
      setInvoices(storedInvoices);
      setExpenses(storedExpenses);
      setIsInitialized(true);
      
    } catch (error) {
      console.error('Error loading financial data:', error);
      // Initialize with empty arrays if there's an error
      setInvoices([]);
      setExpenses([]);
      setIsInitialized(true);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('invoices', JSON.stringify(invoices));
      localStorage.setItem('expenses', JSON.stringify(expenses));
    }
  }, [invoices, expenses, isInitialized]);

  const addInvoice = useCallback((invoice: Omit<Invoice, 'id'>) => {
    const newInvoice = {
      ...invoice,
      id: `INV-${Math.floor(Math.random() * 10000)}`,
    };
    
    setInvoices(prevInvoices => [...prevInvoices, newInvoice]);
    return newInvoice;
  }, []);

  const updateInvoice = useCallback((updatedInvoice: Invoice) => {
    setInvoices(prevInvoices => 
      prevInvoices.map(invoice => 
        invoice.id === updatedInvoice.id ? updatedInvoice : invoice
      )
    );
  }, []);

  const deleteInvoice = useCallback((id: string) => {
    setInvoices(prevInvoices => prevInvoices.filter(invoice => invoice.id !== id));
  }, []);

  const addExpense = useCallback((expense: Omit<Expense, 'id'>) => {
    const newExpense = {
      ...expense,
      id: `EXP-${Math.floor(Math.random() * 10000)}`,
    };
    
    setExpenses(prevExpenses => [...prevExpenses, newExpense]);
    return newExpense;
  }, []);

  const updateExpense = useCallback((updatedExpense: Expense) => {
    setExpenses(prevExpenses => 
      prevExpenses.map(expense => 
        expense.id === updatedExpense.id ? updatedExpense : expense
      )
    );
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setExpenses(prevExpenses => prevExpenses.filter(expense => expense.id !== id));
  }, []);

  const calculateFinancialMetrics = useCallback(() => {
    const currentDate = new Date();
    const monthsData: { [key: string]: MonthlyData } = {};
    
    // Initialize the last 12 months data
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(currentDate.getMonth() - i);
      const monthKey = date.toLocaleString('default', { month: 'short' });
      monthsData[monthKey] = {
        month: monthKey,
        revenue: 0,
        expenses: 0,
        profit: 0
      };
    }

    // Calculate monthly totals for revenue (only from paid invoices)
    invoices.forEach(invoice => {
      if (invoice.status === 'paid') {
        try {
          const invoiceDate = new Date(invoice.date);
          const monthKey = invoiceDate.toLocaleString('default', { month: 'short' });
          
          if (monthsData[monthKey]) {
            const amount = typeof invoice.amount === 'number' 
              ? invoice.amount 
              : parseFloat(String(invoice.amount).replace(/[^\d.-]/g, '')) || 0;
              
            monthsData[monthKey].revenue += amount;
            monthsData[monthKey].profit += amount;
          }
        } catch (error) {
          console.error('Error processing invoice:', error, invoice);
        }
      }
    });

    // Calculate monthly totals for expenses
    expenses.forEach(expense => {
      try {
        const expenseDate = new Date(expense.date);
        const monthKey = expenseDate.toLocaleString('default', { month: 'short' });
        
        if (monthsData[monthKey]) {
          const amount = typeof expense.amount === 'number' 
            ? expense.amount 
            : parseFloat(String(expense.amount).replace(/[^\d.-]/g, '')) || 0;
            
          monthsData[monthKey].expenses += amount;
          monthsData[monthKey].profit -= amount;
        }
      } catch (error) {
        console.error('Error processing expense:', error, expense);
      }
    });

    // Convert to array for charts
    const monthlyData = Object.values(monthsData);

    // Calculate summary metrics
    const totalRevenue = monthlyData.reduce((sum, month) => sum + month.revenue, 0);
    const totalExpenses = monthlyData.reduce((sum, month) => sum + month.expenses, 0);
    const netProfit = totalRevenue - totalExpenses;

    // Calculate outstanding invoices (unpaid or overdue)
    const outstandingInvoices = invoices
      .filter(invoice => invoice.status === 'unpaid' || invoice.status === 'overdue')
      .reduce((sum, invoice) => {
        const amount = typeof invoice.amount === 'number' 
          ? invoice.amount 
          : parseFloat(String(invoice.amount).replace(/[^\d.-]/g, '')) || 0;
        return sum + amount;
      }, 0);

    return {
      monthlyData,
      summary: {
        totalRevenue,
        totalExpenses,
        netProfit,
        outstandingInvoices
      }
    };
  }, [invoices, expenses]);

  return {
    invoices,
    expenses,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    addExpense,
    updateExpense,
    deleteExpense,
    calculateFinancialMetrics
  };
};
