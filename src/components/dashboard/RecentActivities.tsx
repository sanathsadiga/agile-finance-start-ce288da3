
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { useInvoices } from '@/hooks/useInvoices';
import { useExpenses } from '@/hooks/useExpenses';
import { format } from 'date-fns';
import { useSettings } from '@/hooks/useSettings';

const RecentActivities = () => {
  const navigate = useNavigate();
  const { invoices } = useInvoices();
  const { expenses } = useExpenses();
  const { businessSettings } = useSettings();
  const currency = businessSettings?.default_currency || 'USD';
  
  // Merge and sort invoices and expenses by date
  const activities = useMemo(() => {
    const invoiceActivities = (invoices || []).map(invoice => ({
      id: invoice.id,
      date: invoice.date,
      description: invoice.invoice_number ? `Invoice #${invoice.invoice_number}` : 'Invoice',
      amount: invoice.amount,
      status: invoice.status,
      type: 'invoice',
      statusColor: getStatusColor(invoice.status)
    }));
    
    const expenseActivities = (expenses || []).map(expense => ({
      id: expense.id,
      date: expense.date,
      description: expense.description || 'Expense',
      amount: -expense.amount, // Negative for expenses
      status: 'Expense',
      type: 'expense',
      statusColor: 'bg-red-100 text-red-800'
    }));
    
    // Combine and sort by date (newest first)
    return [...invoiceActivities, ...expenseActivities]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5); // Only show the 5 most recent activities
  }, [invoices, expenses]);
  
  // Helper function to get the status color
  function getStatusColor(status: string) {
    switch(status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
  
  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: currency.toUpperCase() 
    }).format(amount);
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      console.error('Error formatting date', error);
      return dateString;
    }
  };

  return (
    <Card className="col-span-3">
      <CardHeader className="pb-3">
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-0">
          {activities.length > 0 ? activities.map((activity) => (
            <div
              key={`${activity.type}-${activity.id}`}
              className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-gray-50 transition-colors"
            >
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">{activity.description}</p>
                <p className="text-sm text-muted-foreground">{formatDate(activity.date)}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-sm font-medium ${activity.amount < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                  {formatCurrency(activity.amount)}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${activity.statusColor}`}>
                  {activity.status}
                </span>
              </div>
            </div>
          )) : (
            <div className="flex items-center justify-center p-6">
              <p className="text-sm text-muted-foreground">No recent activities found</p>
            </div>
          )}
        </div>
        <div className="p-4">
          <Button variant="outline" className="w-full" onClick={() => navigate('/dashboard/invoices')}>
            View All Activity
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivities;
