
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase/database';
import { useToast } from '@/hooks/use-toast';

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

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchExpenses = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Fetch expenses
      const { data: expensesData, error: expensesError } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (expensesError) throw expensesError;

      // Format the data to match our interface
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

      setExpenses(formattedExpenses);
      console.log('Expenses loaded:', formattedExpenses.length);
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

  // Fetch expenses on hook initialization
  useCallback(() => {
    if (user) {
      fetchExpenses();
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

  return {
    expenses,
    isLoading,
    fetchExpenses,
    addExpense,
    updateExpense,
    deleteExpense
  };
};
