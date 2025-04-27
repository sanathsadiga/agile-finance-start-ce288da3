
import { useState, useEffect } from 'react';

export interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  description: string;
}

export interface Expense {
  id: string;
  date: string;
  amount: number;
  category: string;
  description: string;
}

export const useFinancialData = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    // In a real app, this would fetch from your backend
    const storedInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    const storedExpenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    setInvoices(storedInvoices);
    setExpenses(storedExpenses);
  }, []);

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
          lastSixMonths[monthIndex].revenue += invoice.amount;
          lastSixMonths[monthIndex].profit += invoice.amount;
        }
      }
    });

    expenses.forEach(expense => {
      const expenseDate = new Date(expense.date);
      const monthIndex = lastSixMonths.findIndex(m => 
        m.month === expenseDate.toLocaleString('default', { month: 'short' })
      );
      if (monthIndex !== -1) {
        lastSixMonths[monthIndex].expenses += expense.amount;
        lastSixMonths[monthIndex].profit -= expense.amount;
      }
    });

    const totalRevenue = lastSixMonths.reduce((sum, month) => sum + month.revenue, 0);
    const totalExpenses = lastSixMonths.reduce((sum, month) => sum + month.expenses, 0);
    const netProfit = totalRevenue - totalExpenses;

    const outstandingInvoices = invoices
      .filter(invoice => invoice.status !== 'paid')
      .reduce((sum, invoice) => sum + invoice.amount, 0);

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
    calculateFinancialMetrics
  };
};
