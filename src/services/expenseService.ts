
import { api } from './api';

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
}

export const expenseService = {
  // Get all expenses
  getExpenses: async (): Promise<Expense[]> => {
    return api.get<Expense[]>('/expenses');
  },

  // Get expense by ID
  getExpense: async (id: string): Promise<Expense> => {
    return api.get<Expense>(`/expenses/${id}`);
  },

  // Create new expense
  createExpense: async (expense: Omit<Expense, 'id'>): Promise<Expense> => {
    return api.post<Expense>('/expenses', expense);
  },

  // Update expense
  updateExpense: async (id: string, expense: Partial<Expense>): Promise<Expense> => {
    return api.put<Expense>(`/expenses/${id}`, expense);
  },

  // Delete expense
  deleteExpense: async (id: string): Promise<void> => {
    return api.delete(`/expenses/${id}`);
  },
};
