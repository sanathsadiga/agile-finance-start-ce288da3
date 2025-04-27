
import { useState, useEffect } from 'react';

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

export const useFinancialData = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    // Fetch from localStorage
    const storedInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    const storedExpenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    setInvoices(storedInvoices);
    setExpenses(storedExpenses);
  }, []);

  const addInvoice = (invoice: Omit<Invoice, 'id'>) => {
    const newInvoice = {
      ...invoice,
      id: `INV-${Math.floor(Math.random() * 10000)}`,
    };
    
    const updatedInvoices = [...invoices, newInvoice];
    setInvoices(updatedInvoices);
    localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
    return newInvoice;
  };

  const updateInvoice = (updatedInvoice: Invoice) => {
    const updatedInvoices = invoices.map(invoice => 
      invoice.id === updatedInvoice.id ? updatedInvoice : invoice
    );
    setInvoices(updatedInvoices);
    localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
  };

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = {
      ...expense,
      id: `EXP-${Math.floor(Math.random() * 10000)}`,
    };
    
    const updatedExpenses = [...expenses, newExpense];
    setExpenses(updatedExpenses);
    localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
    return newExpense;
  };

  const updateExpense = (updatedExpense: Expense) => {
    const updatedExpenses = expenses.map(expense => 
      expense.id === updatedExpense.id ? updatedExpense : expense
    );
    setExpenses(updatedExpenses);
    localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
  };

  const calculateFinancialMetrics = () => {
    const currentDate = new Date();
    const lastSixMonths = new Array(6).fill(null).map((_, index) => {
      const date = new Date();
      date.setMonth(currentDate.getMonth() - index);
      return {
        month: date.toLocaleString('default', { month: 'short' }),
        revenue: 0,
        expenses: 0,
        profit: 0
      };
    }).reverse();

    // Calculate monthly totals
    invoices.forEach(invoice => {
      if (invoice.status === 'paid') {
        const invoiceDate = new Date(invoice.date);
        const monthIndex = lastSixMonths.findIndex(m => 
          m.month === invoiceDate.toLocaleString('default', { month: 'short' })
        );
        if (monthIndex !== -1) {
          lastSixMonths[monthIndex].revenue += parseFloat(String(invoice.amount).replace(/[^\d.-]/g, ''));
          lastSixMonths[monthIndex].profit += parseFloat(String(invoice.amount).replace(/[^\d.-]/g, ''));
        }
      }
    });

    expenses.forEach(expense => {
      const expenseDate = new Date(expense.date);
      const monthIndex = lastSixMonths.findIndex(m => 
        m.month === expenseDate.toLocaleString('default', { month: 'short' })
      );
      if (monthIndex !== -1) {
        lastSixMonths[monthIndex].expenses += parseFloat(String(expense.amount).replace(/[^\d.-]/g, ''));
        lastSixMonths[monthIndex].profit -= parseFloat(String(expense.amount).replace(/[^\d.-]/g, ''));
      }
    });

    // Calculate totals
    const totalRevenue = lastSixMonths.reduce((sum, month) => sum + month.revenue, 0);
    const totalExpenses = lastSixMonths.reduce((sum, month) => sum + month.expenses, 0);
    const netProfit = totalRevenue - totalExpenses;

    // Calculate outstanding invoices
    const outstandingInvoices = invoices
      .filter(invoice => invoice.status !== 'paid')
      .reduce((sum, invoice) => sum + parseFloat(String(invoice.amount).replace(/[^\d.-]/g, '')), 0);

    return {
      monthlyData: lastSixMonths,
      summary: {
        totalRevenue,
        totalExpenses,
        netProfit,
        outstandingInvoices
      }
    };
  };

  return {
    invoices,
    expenses,
    addInvoice,
    updateInvoice,
    addExpense,
    updateExpense,
    calculateFinancialMetrics
  };
};
