
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell as RechartsCell } from "recharts";
import StatsCard from "@/components/stats/StatsCard";
import { DollarSign, TrendingUp, CreditCard, ArrowDownRight, ArrowUpRight, Download, Filter } from "lucide-react";
import DashboardHeader from '@/components/layout/DashboardHeader';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const revenueData = [
  { name: "Jan", revenue: 2400 },
  { name: "Feb", revenue: 1398 },
  { name: "Mar", revenue: 9800 },
  { name: "Apr", revenue: 3908 },
  { name: "May", revenue: 4800 },
  { name: "Jun", revenue: 3800 },
];

const expenseData = [
  { name: "Jan", expenses: 1400 },
  { name: "Feb", expenses: 2398 },
  { name: "Mar", expenses: 5800 },
  { name: "Apr", expenses: 3908 },
  { name: "May", expenses: 2800 },
  { name: "Jun", expenses: 1800 },
];

const categoryData = [
  { name: "Rent", value: 2400 },
  { name: "Utilities", value: 1398 },
  { name: "Software", value: 9800 },
  { name: "Marketing", value: 3908 },
  { name: "Salaries", value: 8800 },
];

const COLORS = ["#9b87f5", "#7E69AB", "#6E59A5", "#1A1F2C", "#D6BCFA"];

const Reports = () => {
  const { toast } = useToast();
  const [timeframe, setTimeframe] = useState("month");
  const [reportType, setReportType] = useState("overview");

  const handleDownloadReport = () => {
    toast({
      title: "Report download started",
      description: "Your financial report is being generated and will download shortly."
    });
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-50">
      <DashboardHeader />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Financial Reports</h2>
            <p className="text-muted-foreground">Analyze your business performance and make data-driven decisions</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="quarter">Last Quarter</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
            
            <Button onClick={handleDownloadReport} className="w-full sm:w-auto">
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-4" value={reportType} onValueChange={setReportType}>
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="taxes">Tax Report</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Total Revenue"
                value="$24,456.00"
                icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
                trend={{ value: 12, isPositive: true }}
              />
              <StatsCard
                title="Monthly Growth"
                value="24.5%"
                icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
                trend={{ value: 8, isPositive: true }}
              />
              <StatsCard
                title="Total Expenses"
                value="$12,145.00"
                icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
                trend={{ value: 4, isPositive: false }}
              />
              <StatsCard
                title="Net Profit"
                value="$12,311.00"
                icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
                trend={{ value: 18, isPositive: true }}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Revenue vs Expenses</CardTitle>
                    <CardDescription>
                      Six month comparison of revenue and expenses
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-3.5 w-3.5 mr-2" />
                    Filter
                  </Button>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart
                      data={revenueData.map((item, index) => ({
                        name: item.name,
                        revenue: item.revenue,
                        expenses: expenseData[index].expenses,
                      }))}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="revenue" fill="#9b87f5" />
                      <Bar dataKey="expenses" fill="#1A1F2C" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Expense Breakdown</CardTitle>
                    <CardDescription>
                      Distribution of expenses by category
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-3.5 w-3.5 mr-2" />
                    Filter
                  </Button>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <RechartsCell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="income" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Income Analysis</CardTitle>
                <CardDescription>
                  Detailed breakdown of your revenue sources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-6">Analyze your income streams and identify growth opportunities.</p>
                <div className="h-[400px] flex items-center justify-center border border-dashed rounded-md">
                  <p className="text-muted-foreground">Income report visualization will appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expenses" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Expense Analysis</CardTitle>
                <CardDescription>
                  Detailed breakdown of your business expenses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-6">Track spending patterns and identify cost-saving opportunities.</p>
                <div className="h-[400px] flex items-center justify-center border border-dashed rounded-md">
                  <p className="text-muted-foreground">Expense report visualization will appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="taxes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tax Report</CardTitle>
                <CardDescription>
                  Estimated tax obligations and deductions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-6">Stay ahead of your tax obligations with quarterly estimates.</p>
                <div className="h-[400px] flex items-center justify-center border border-dashed rounded-md">
                  <p className="text-muted-foreground">Tax report visualization will appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Reports;
