
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import StatsCard from "@/components/stats/StatsCard";
import { DollarSign, TrendingUp, CreditCard, ArrowDownRight, ArrowUpRight } from "lucide-react";

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
  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-50">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Financial Reports</h2>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
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
                <CardHeader>
                  <CardTitle>Revenue vs Expenses</CardTitle>
                  <CardDescription>
                    Six month comparison of revenue and expenses
                  </CardDescription>
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
                <CardHeader>
                  <CardTitle>Expense Breakdown</CardTitle>
                  <CardDescription>
                    Distribution of expenses by category
                  </CardDescription>
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
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} dataKey="value" />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="detailed" className="space-y-4">
            {/* Additional detailed reporting content can go here */}
            <Card>
              <CardHeader>
                <CardTitle>Detailed Financial Analysis</CardTitle>
                <CardDescription>
                  Complete breakdown of financial data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Detailed financial reports coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Reports;
