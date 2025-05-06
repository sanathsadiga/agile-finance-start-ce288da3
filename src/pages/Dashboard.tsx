
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useToast } from '@/hooks/use-toast';
import { ArrowUpRight, ArrowDownRight, Plus, Eye, FileText, FileMinus, ArrowRight, Calendar, CreditCard, DollarSign } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import SummaryCards from '@/components/dashboard/SummaryCards';
import RecentActivities from '@/components/dashboard/RecentActivities';
import DashboardCharts from '@/components/dashboard/DashboardCharts';
import { useExpenses } from '@/hooks/useExpenses';
import { useInvoices } from '@/hooks/useInvoices';
import { useSupabaseFinancialData } from '@/hooks/useSupabaseFinancialData';
import { useSettings } from '@/hooks/useSettings';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const { expenses } = useExpenses();
  const { invoices } = useInvoices();
  const { businessSettings } = useSettings();
  const currency = businessSettings?.default_currency || 'USD';
  const { calculateFinancialMetrics } = useSupabaseFinancialData();
  const { summary, monthlyData } = calculateFinancialMetrics();
  
  // Format currency based on user settings
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: currency.toUpperCase() 
    }).format(amount);
  };
  
  // Process expense data by category for the chart
  const expensesByCategory = React.useMemo(() => {
    if (!expenses || expenses.length === 0) return [];
    
    const categoryMap: Record<string, number> = {};
    
    expenses.forEach(expense => {
      const category = expense.category || 'Other';
      if (!categoryMap[category]) {
        categoryMap[category] = 0;
      }
      categoryMap[category] += expense.amount;
    });
    
    return Object.entries(categoryMap).map(([category, amount]) => ({
      category,
      amount
    })).sort((a, b) => b.amount - a.amount);
  }, [expenses]);

  // Calculate total expenses
  const totalExpenses = React.useMemo(() => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses]);
  
  // Calculate invoice stats
  const invoiceStats = React.useMemo(() => {
    const stats = {
      paid: { count: 0, amount: 0 },
      pending: { count: 0, amount: 0 },
      overdue: { count: 0, amount: 0 }
    };
    
    invoices.forEach(invoice => {
      if (invoice.status === 'paid') {
        stats.paid.count++;
        stats.paid.amount += invoice.amount;
      } else if (invoice.status === 'pending') {
        stats.pending.count++;
        stats.pending.amount += invoice.amount;
      } else if (invoice.status === 'overdue') {
        stats.overdue.count++;
        stats.overdue.amount += invoice.amount;
      }
    });
    
    return stats;
  }, [invoices]);
  
  // Cash flow data for the last 6 months
  const cashFlowData = React.useMemo(() => {
    return monthlyData.slice(-6).map(month => ({
      month: month.month,
      in: month.revenue,
      out: month.expenses,
      net: month.profit
    }));
  }, [monthlyData]);
  
  // Calculate cash flow stats
  const cashFlowStats = React.useMemo(() => {
    if (cashFlowData.length === 0) {
      return {
        cashIn: 0,
        cashOut: 0,
        netCashFlow: 0,
        upcomingPayments: 0,
        cashInChange: 0,
        cashOutChange: 0,
        netCashFlowChange: 0
      };
    }
    
    const currentMonth = cashFlowData[cashFlowData.length - 1];
    const previousMonth = cashFlowData.length > 1 ? cashFlowData[cashFlowData.length - 2] : null;
    
    const cashIn = currentMonth.in;
    const cashOut = currentMonth.out;
    const netCashFlow = currentMonth.net;
    
    // Calculate percentage changes if previous month data is available
    const cashInChange = previousMonth ? ((cashIn - previousMonth.in) / previousMonth.in) * 100 : 0;
    const cashOutChange = previousMonth ? ((cashOut - previousMonth.out) / previousMonth.out) * 100 : 0;
    const netCashFlowChange = previousMonth ? ((netCashFlow - previousMonth.net) / previousMonth.net) * 100 : 0;
    
    // Calculate upcoming payments (due in next 7 days)
    const next7Days = new Date();
    next7Days.setDate(next7Days.getDate() + 7);
    
    const upcomingPayments = invoices
      .filter(invoice => {
        if (!invoice.dueDate) return false;
        const dueDate = new Date(invoice.dueDate);
        const today = new Date();
        return dueDate > today && dueDate <= next7Days;
      })
      .reduce((sum, invoice) => sum + invoice.amount, 0);
    
    return {
      cashIn,
      cashOut,
      netCashFlow,
      upcomingPayments,
      cashInChange,
      cashOutChange,
      netCashFlowChange
    };
  }, [cashFlowData, invoices]);
  
  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleCreateInvoice = () => {
    navigate('/dashboard/invoices');
    toast({
      title: "Create new invoice",
      description: "You can now create a new invoice."
    });
  };

  const handleAddExpense = () => {
    navigate('/dashboard/expenses');
    toast({
      title: "Add new expense",
      description: "You can now record a new expense."
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-purple"></div>
        <p className="mt-4 text-gray-500">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <DashboardHeader />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Welcome back, {user?.firstName || 'User'}</h2>
            <p className="text-muted-foreground">Here's an overview of your business finances</p>
          </div>
          <div className="flex gap-2 self-start sm:self-center">
            <Button variant="outline" onClick={handleCreateInvoice}>
              <FileText className="mr-2 h-4 w-4" />
              New Invoice
            </Button>
            <Button onClick={handleAddExpense}>
              <Plus className="mr-2 h-4 w-4" />
              Add Expense
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <SummaryCards />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <DashboardCharts />
              <RecentActivities />
            </div>
          </TabsContent>
          
          <TabsContent value="cashflow" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Cash In</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(cashFlowStats.cashIn)}</div>
                  <p className="text-xs text-muted-foreground">
                    {cashFlowStats.cashInChange >= 0 ? '+' : ''}{cashFlowStats.cashInChange.toFixed(1)}% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Cash Out</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(cashFlowStats.cashOut)}</div>
                  <p className="text-xs text-muted-foreground">
                    {cashFlowStats.cashOutChange >= 0 ? '+' : ''}{cashFlowStats.cashOutChange.toFixed(1)}% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Net Cash Flow</CardTitle>
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(cashFlowStats.netCashFlow)}</div>
                  <p className="text-xs text-muted-foreground">
                    {cashFlowStats.netCashFlowChange >= 0 ? '+' : ''}{cashFlowStats.netCashFlowChange.toFixed(1)}% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Upcoming Payments</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(cashFlowStats.upcomingPayments)}</div>
                  <p className="text-xs text-muted-foreground">
                    Due within 7 days
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Cash Flow Trend (Last 6 Months)</CardTitle>
                <CardDescription>Monitor your cash flow patterns over time</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart
                    data={cashFlowData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                    <Line type="monotone" dataKey="in" stroke="#9b87f5" name="Cash In" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="out" stroke="#ef4444" name="Cash Out" />
                    <Line type="monotone" dataKey="net" stroke="#10b981" name="Net Cash Flow" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="invoices" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Invoice Summary</h3>
                <p className="text-sm text-muted-foreground">Track the status of your invoices</p>
              </div>
              <Button onClick={() => navigate('/dashboard/invoices')}>
                View All Invoices
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="bg-green-50 text-green-900 rounded-t-lg">
                  <CardTitle className="text-base font-medium flex items-center">
                    <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                    Paid
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{formatCurrency(invoiceStats.paid.amount)}</div>
                  <p className="text-xs text-muted-foreground">
                    {invoiceStats.paid.count} invoice{invoiceStats.paid.count !== 1 ? 's' : ''}
                  </p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="ghost" size="sm" className="w-full" onClick={() => navigate('/dashboard/invoices')}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="bg-yellow-50 text-yellow-900 rounded-t-lg">
                  <CardTitle className="text-base font-medium flex items-center">
                    <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
                    Pending
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{formatCurrency(invoiceStats.pending.amount)}</div>
                  <p className="text-xs text-muted-foreground">
                    {invoiceStats.pending.count} invoice{invoiceStats.pending.count !== 1 ? 's' : ''}
                  </p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="ghost" size="sm" className="w-full" onClick={() => navigate('/dashboard/invoices')}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="bg-red-50 text-red-900 rounded-t-lg">
                  <CardTitle className="text-base font-medium flex items-center">
                    <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                    Overdue
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{formatCurrency(invoiceStats.overdue.amount)}</div>
                  <p className="text-xs text-muted-foreground">
                    {invoiceStats.overdue.count} invoice{invoiceStats.overdue.count !== 1 ? 's' : ''}
                  </p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="ghost" size="sm" className="w-full" onClick={() => navigate('/dashboard/invoices')}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="expenses" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Expense Overview</h3>
                <p className="text-sm text-muted-foreground">Your expense breakdown by category</p>
              </div>
              <Button onClick={() => navigate('/dashboard/expenses')}>
                View All Expenses
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            <Card>
              <CardContent className="pt-6">
                {expensesByCategory.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={expensesByCategory}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis tickFormatter={(value) => formatCurrency(value)} />
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      <Bar dataKey="amount" fill="#7E69AB" name="Amount" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px]">
                    <p className="text-muted-foreground">No expense data available</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  Total expenses: <span className="font-medium text-red-600">{formatCurrency(totalExpenses)}</span>
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
