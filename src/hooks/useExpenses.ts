
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase/database';
import { useToast } from '@/hooks/use-toast';

export interface Expense {
  id: string;
  date: string;
  amount: number;
  category: string;
  payment_method: string;
  description: string;
  vendor?: string;
  receipt?: boolean;
  receipt_url?: string;
  notes?: string;
  is_recurring?: boolean;
  recurrence_frequency?: string;
  recurrence_interval?: number;
  recurrence_end_date?: string;
  currency?: string;
  user_id?: string;
  user_email?: string;
  user_name?: string;
}

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchExpenses = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      console.log('Fetching expenses for user:', user.id);
      
      // Fetch expenses
      const { data: expensesData, error: expensesError } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (expensesError) throw expensesError;

      setExpenses(expensesData || []);
      console.log('Expenses loaded:', expensesData?.length);
    } catch (error) {
      console.error('Error loading expenses from Supabase:', error);
      toast({
        title: "Failed to load expenses",
        description: "There was a problem loading your expense data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  // Fetch expenses whenever the user changes
  useEffect(() => {
    if (user) {
      fetchExpenses();
    } else {
      setExpenses([]);
      setIsLoading(false);
    }
  }, [user, fetchExpenses]);

  const addExpense = useCallback(async (expense: Omit<Expense, 'id'>) => {
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    try {
      // Format the data for Supabase
      const supabaseExpense = {
        user_id: user.id,
        user_email: user.email,
        user_name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        date: expense.date,
        amount: expense.amount,
        category: expense.category,
        payment_method: expense.payment_method || 'card',
        description: expense.description,
        vendor: expense.vendor || null,
        receipt: expense.receipt || false,
        receipt_url: expense.receipt_url || null,
        notes: expense.notes || null,
        is_recurring: expense.is_recurring || false,
        recurrence_frequency: expense.recurrence_frequency || null,
        recurrence_interval: expense.recurrence_interval || null,
        recurrence_end_date: expense.recurrence_end_date || null,
        currency: expense.currency || 'usd'
      };
      
      console.log('Adding expense:', supabaseExpense);
      
      // Insert into Supabase
      const { data, error } = await supabase
        .from('expenses')
        .insert(supabaseExpense)
        .select()
        .single();
      
      if (error) throw error;
      
      console.log('Expense added successfully:', data);
      
      // Update local state
      setExpenses(prev => [data, ...prev]);
      
      toast({
        title: "Expense added",
        description: "Your expense has been successfully added.",
      });
      
      return data;
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
        payment_method: updatedExpense.payment_method || 'card',
        description: updatedExpense.description,
        vendor: updatedExpense.vendor || null,
        receipt: updatedExpense.receipt || false,
        receipt_url: updatedExpense.receipt_url || null,
        notes: updatedExpense.notes || null,
        is_recurring: updatedExpense.is_recurring || false,
        recurrence_frequency: updatedExpense.recurrence_frequency || null,
        recurrence_interval: updatedExpense.recurrence_interval || null,
        recurrence_end_date: updatedExpense.recurrence_end_date || null,
        currency: updatedExpense.currency || 'usd'
      };
      
      // Update in Supabase
      const { data, error } = await supabase
        .from('expenses')
        .update(supabaseExpense)
        .eq('id', updatedExpense.id)
        .eq('user_id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Update local state
      setExpenses(prev => 
        prev.map(expense => 
          expense.id === updatedExpense.id ? data : expense
        )
      );
      
      toast({
        title: "Expense updated",
        description: "Your expense has been successfully updated.",
      });
      
      return data;
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

  return {
    expenses,
    isLoading,
    fetchExpenses,
    addExpense,
    updateExpense,
    deleteExpense
  };
};
