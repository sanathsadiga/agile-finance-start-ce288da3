
import { Invoice } from '../hooks/useInvoices';
import { Expense } from '../hooks/useExpenses';

interface MonthlyData {
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

export const calculateFinancialMetrics = (
  invoices: Invoice[],
  expenses: Expense[]
) => {
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

  // Calculate summary metrics - only count paid invoices in revenue
  const totalRevenue = invoices
    .filter(invoice => invoice.status === 'paid')
    .reduce((sum, invoice) => {
      const amount = typeof invoice.amount === 'number' 
        ? invoice.amount 
        : parseFloat(String(invoice.amount).replace(/[^\d.-]/g, '')) || 0;
      return sum + amount;
    }, 0);
    
  const totalExpenses = expenses.reduce((sum, expense) => {
    const amount = typeof expense.amount === 'number' 
      ? expense.amount 
      : parseFloat(String(expense.amount).replace(/[^\d.-]/g, '')) || 0;
    return sum + amount;
  }, 0);
  
  const netProfit = totalRevenue - totalExpenses;

  // Calculate outstanding invoices (pending or overdue, but not paid or draft)
  const outstandingInvoices = invoices
    .filter(invoice => invoice.status === 'pending' || invoice.status === 'overdue')
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
};
