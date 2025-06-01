
import { Invoice } from '@/services/invoiceService';
import { Expense } from '@/services/expenseService';

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

export const calculateFinancialMetrics = (invoices: Invoice[], expenses: Expense[]) => {
  // Calculate totals
  const totalRevenue = invoices
    .filter(invoice => invoice.status === 'paid')
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  const outstandingInvoices = invoices
    .filter(invoice => invoice.status !== 'paid')
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  const totalExpenses = expenses
    .reduce((sum, expense) => sum + expense.amount, 0);

  const netProfit = totalRevenue - totalExpenses;

  // Generate monthly data for charts
  const monthlyData: MonthlyData[] = [];
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  // For demo purposes, generate sample monthly data
  // In a real app, this would aggregate actual data by month
  for (let i = 0; i < 12; i++) {
    const monthRevenue = Math.floor(Math.random() * 10000) + 5000;
    const monthExpenses = Math.floor(Math.random() * 6000) + 2000;
    
    monthlyData.push({
      month: months[i],
      revenue: monthRevenue,
      expenses: monthExpenses,
      profit: monthRevenue - monthExpenses,
    });
  }

  const summary: FinancialSummary = {
    totalRevenue,
    totalExpenses,
    netProfit,
    outstandingInvoices,
  };

  return {
    summary,
    monthlyData,
  };
};
