
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase/database';
import { useToast } from '@/hooks/use-toast';

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

export const useSupabaseFinancialData = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load data from Supabase
  useEffect(() => {
    if (!user) return;
    
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch invoices
        const { data: invoicesData, error: invoicesError } = await supabase
          .from('invoices')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false });

        if (invoicesError) throw invoicesError;

        // Fetch expenses
        const { data: expensesData, error: expensesError } = await supabase
          .from('expenses')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false });

        if (expensesError) throw expensesError;

        // Format the data to match our interface
        const formattedInvoices = invoicesData.map(invoice => ({
          id: invoice.id,
          date: invoice.date,
          dueDate: invoice.due_date || undefined,
          customer: invoice.customer || undefined,
          email: invoice.email || undefined,
          amount: invoice.amount,
          status: invoice.status,
          description: invoice.description || undefined,
          notes: invoice.notes || undefined
        }));

        const formattedExpenses = expensesData.map(expense => ({
          id: expense.id,
          date: expense.date,
          amount: expense.amount,
          category: expense.category,
          description: expense.description,
          vendor: expense.vendor || undefined,
          receipt: expense.receipt || undefined,
          notes: expense.notes || undefined
        }));

        setInvoices(formattedInvoices);
        setExpenses(formattedExpenses);
      } catch (error) {
        console.error('Error loading financial data from Supabase:', error);
        toast({
          title: "Failed to load data",
          description: "There was a problem loading your financial data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, toast]);

  const addInvoice = useCallback(async (invoice: Omit<Invoice, 'id'>) => {
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    try {
      // Format the data for Supabase
      const supabaseInvoice = {
        user_id: user.id,
        date: invoice.date,
        due_date: invoice.dueDate || null,
        customer: invoice.customer || null,
        email: invoice.email || null,
        amount: invoice.amount,
        status: invoice.status,
        description: invoice.description || null,
        notes: invoice.notes || null
      };
      
      // Insert into Supabase
      const { data, error } = await supabase
        .from('invoices')
        .insert(supabaseInvoice)
        .select()
        .single();
      
      if (error) throw error;
      
      // Format the returned data
      const newInvoice: Invoice = {
        id: data.id,
        date: data.date,
        dueDate: data.due_date || undefined,
        customer: data.customer || undefined,
        email: data.email || undefined,
        amount: data.amount,
        status: data.status,
        description: data.description || undefined,
        notes: data.notes || undefined
      };
      
      // Update local state
      setInvoices(prev => [newInvoice, ...prev]);
      
      return newInvoice;
    } catch (error) {
      console.error('Error adding invoice:', error);
      toast({
        title: "Failed to add invoice",
        description: "There was a problem adding your invoice.",
        variant: "destructive",
      });
      throw error;
    }
  }, [user, toast]);

  const updateInvoice = useCallback(async (updatedInvoice: Invoice) => {
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    try {
      // Format the data for Supabase
      const supabaseInvoice = {
        date: updatedInvoice.date,
        due_date: updatedInvoice.dueDate || null,
        customer: updatedInvoice.customer || null,
        email: updatedInvoice.email || null,
        amount: updatedInvoice.amount,
        status: updatedInvoice.status,
        description: updatedInvoice.description || null,
        notes: updatedInvoice.notes || null
      };
      
      // Update in Supabase
      const { error } = await supabase
        .from('invoices')
        .update(supabaseInvoice)
        .eq('id', updatedInvoice.id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Update local state
      setInvoices(prev => 
        prev.map(invoice => 
          invoice.id === updatedInvoice.id ? updatedInvoice : invoice
        )
      );
      
      toast({
        title: "Invoice updated",
        description: "Your invoice has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating invoice:', error);
      toast({
        title: "Failed to update invoice",
        description: "There was a problem updating your invoice.",
        variant: "destructive",
      });
      throw error;
    }
  }, [user, toast]);

  const deleteInvoice = useCallback(async (id: string) => {
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    try {
      // Delete from Supabase with RLS protection
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Update local state
      setInvoices(prev => prev.filter(invoice => invoice.id !== id));
      
      toast({
        title: "Invoice deleted",
        description: "Your invoice has been successfully deleted.",
      });
    } catch (error) {
      console.error('Error deleting invoice:', error);
      toast({
        title: "Failed to delete invoice",
        description: "There was a problem deleting your invoice.",
        variant: "destructive",
      });
      throw error;
    }
  }, [user, toast]);

  const addExpense = useCallback(async (expense: Omit<Expense, 'id'>) => {
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    try {
      // Format the data for Supabase
      const supabaseExpense = {
        user_id: user.id,
        date: expense.date,
        amount: expense.amount,
        category: expense.category,
        description: expense.description,
        vendor: expense.vendor || null,
        receipt: expense.receipt || null,
        notes: expense.notes || null
      };
      
      // Insert into Supabase
      const { data, error } = await supabase
        .from('expenses')
        .insert(supabaseExpense)
        .select()
        .single();
      
      if (error) throw error;
      
      // Format the returned data
      const newExpense: Expense = {
        id: data.id,
        date: data.date,
        amount: data.amount,
        category: data.category,
        description: data.description,
        vendor: data.vendor || undefined,
        receipt: data.receipt || undefined,
        notes: data.notes || undefined
      };
      
      // Update local state
      setExpenses(prev => [newExpense, ...prev]);
      
      return newExpense;
    } catch (error) {
      console.error('Error adding expense:', error);
      toast({
        title: "Failed to add expense",
        description: "There was a problem adding your expense.",
        variant: "destructive",
      });
      throw error;
    }
  }, [user, toast]);

  const updateExpense = useCallback(async (updatedExpense: Expense) => {
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    try {
      // Format the data for Supabase
      const supabaseExpense = {
        date: updatedExpense.date,
        amount: updatedExpense.amount,
        category: updatedExpense.category,
        description: updatedExpense.description,
        vendor: updatedExpense.vendor || null,
        receipt: updatedExpense.receipt || null,
        notes: updatedExpense.notes || null
      };
      
      // Update in Supabase
      const { error } = await supabase
        .from('expenses')
        .update(supabaseExpense)
        .eq('id', updatedExpense.id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Update local state
      setExpenses(prev => 
        prev.map(expense => 
          expense.id === updatedExpense.id ? updatedExpense : expense
        )
      );
      
      toast({
        title: "Expense updated",
        description: "Your expense has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating expense:', error);
      toast({
        title: "Failed to update expense",
        description: "There was a problem updating your expense.",
        variant: "destructive",
      });
      throw error;
    }
  }, [user, toast]);

  const deleteExpense = useCallback(async (id: string) => {
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    try {
      // Delete from Supabase with RLS protection
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Update local state
      setExpenses(prev => prev.filter(expense => expense.id !== id));
      
      toast({
        title: "Expense deleted",
        description: "Your expense has been successfully deleted.",
      });
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast({
        title: "Failed to delete expense",
        description: "There was a problem deleting your expense.",
        variant: "destructive",
      });
      throw error;
    }
  }, [user, toast]);

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
    isLoading,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    addExpense,
    updateExpense,
    deleteExpense,
    calculateFinancialMetrics
  };
};
