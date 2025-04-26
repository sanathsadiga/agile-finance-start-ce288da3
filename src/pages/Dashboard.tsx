
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

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleCreateInvoice = () => {
    navigate('/invoices');
    toast({
      title: "Create new invoice",
      description: "You can now create a new invoice."
    });
  };

  const handleAddExpense = () => {
    navigate('/expenses');
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
                  <div className="text-2xl font-bold">$18,650</div>
                  <p className="text-xs text-muted-foreground">
                    +12.5% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Cash Out</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$10,245</div>
                  <p className="text-xs text-muted-foreground">
                    +2.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Net Cash Flow</CardTitle>
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$8,405</div>
                  <p className="text-xs text-muted-foreground">
                    +20.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Upcoming Payments</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$3,240</div>
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
                    data={[
                      { month: "Jan", in: 12400, out: 8400, net: 4000 },
                      { month: "Feb", in: 14100, out: 9200, net: 4900 },
                      { month: "Mar", in: 15800, out: 9800, net: 6000 },
                      { month: "Apr", in: 16200, out: 10500, net: 5700 },
                      { month: "May", in: 18000, out: 11200, net: 6800 },
                      { month: "Jun", in: 18650, out: 10245, net: 8405 }
                    ]}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
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
              <Button onClick={() => navigate('/invoices')}>
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
                  <div className="text-2xl font-bold">$14,500</div>
                  <p className="text-xs text-muted-foreground">
                    3 invoices
                  </p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="ghost" size="sm" className="w-full" onClick={() => navigate('/invoices')}>
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
                  <div className="text-2xl font-bold">$8,250</div>
                  <p className="text-xs text-muted-foreground">
                    2 invoices
                  </p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="ghost" size="sm" className="w-full" onClick={() => navigate('/invoices')}>
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
                  <div className="text-2xl font-bold">$3,000</div>
                  <p className="text-xs text-muted-foreground">
                    1 invoice
                  </p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="ghost" size="sm" className="w-full" onClick={() => navigate('/invoices')}>
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
              <Button onClick={() => navigate('/expenses')}>
                View All Expenses
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            <Card>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={[
                      { category: "Software", amount: 2480 },
                      { category: "Rent", amount: 3500 },
                      { category: "Marketing", amount: 1850 },
                      { category: "Utilities", amount: 940 },
                      { category: "Salaries", amount: 5670 },
                      { category: "Other", amount: 1240 }
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="amount" fill="#7E69AB" name="Amount ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  Total expenses this month: <span className="font-medium text-red-600">$15,680</span>
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
