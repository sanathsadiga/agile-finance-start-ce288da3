
import { useState, useEffect, useCallback } from 'react';
import { expenseService, Expense } from '@/services/expenseService';
import { useToast } from '@/hooks/use-toast';

export type { Expense } from '@/services/expenseService';

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchExpenses = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await expenseService.getExpenses();
      setExpenses(data);
      return data;
    } catch (error: any) {
      console.error('Error fetching expenses:', error);
      toast({
        title: 'Failed to load expenses',
        description: error.message || 'Could not load expenses',
        variant: 'destructive',
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

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

  return {
    expenses,
    isLoading,
    fetchExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
  };
};
