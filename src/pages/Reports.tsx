
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart, PieChart, Pie, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line } from "recharts";

// Placeholder data for charts
const monthlyData = [
  { name: 'Jan', income: 4000, expenses: 2400 },
  { name: 'Feb', income: 3000, expenses: 1398 },
  { name: 'Mar', income: 2000, expenses: 9800 },
  { name: 'Apr', income: 2780, expenses: 3908 },
  { name: 'May', income: 1890, expenses: 4800 },
  { name: 'Jun', income: 2390, expenses: 3800 },
  { name: 'Jul', income: 3490, expenses: 4300 },
];

const expensesByCategory = [
  { name: 'Software', value: 400 },
  { name: 'Office', value: 300 },
  { name: 'Travel', value: 500 },
  { name: 'Meals', value: 200 },
  { name: 'Marketing', value: 350 },
  { name: 'Other', value: 150 },
];

const profitLoss = {
  income: {
    total: "$14,550",
    items: [
      { name: "Client Services", amount: "$8,200" },
      { name: "Product Sales", amount: "$4,350" },
      { name: "Affiliate Revenue", amount: "$1,800" },
      { name: "Other Income", amount: "$200" },
    ]
  },
  expenses: {
    total: "$5,980",
    items: [
      { name: "Software Subscriptions", amount: "$980" },
      { name: "Office Supplies", amount: "$320" },
      { name: "Travel", amount: "$1,200" },
      { name: "Meals & Entertainment", amount: "$450" },
      { name: "Marketing", amount: "$1,800" },
      { name: "Utilities", amount: "$230" },
      { name: "Other Expenses", amount: "$1,000" },
    ]
  },
  profit: "$8,570"
};

// Colors for charts
const COLORS = ['#9b87f5', '#7E69AB', '#6E59A5', '#D6BCFA', '#1A1F2C', '#8E9196'];

const Reports = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Financial Reports</h1>
          <p className="text-gray-600">View your business performance metrics</p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Income vs. Expenses</CardTitle>
              <CardDescription>Monthly comparison for the current year</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="income" fill="#9b87f5" name="Income" />
                  <Bar dataKey="expenses" fill="#6E59A5" name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Expenses by Category</CardTitle>
              <CardDescription>Breakdown of where your money goes</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expensesByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {expensesByCategory.map((entry, index) => (
                      <Pie key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Profit & Loss Statement</CardTitle>
            <CardDescription>Summary of your business's financial performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-4">Income</h3>
                <div className="space-y-2">
                  {profitLoss.income.items.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-gray-600">{item.name}</span>
                      <span>{item.amount}</span>
                    </div>
                  ))}
                  <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between font-semibold">
                    <span>Total Income</span>
                    <span className="text-green-600">{profitLoss.income.total}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-4">Expenses</h3>
                <div className="space-y-2">
                  {profitLoss.expenses.items.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-gray-600">{item.name}</span>
                      <span>{item.amount}</span>
                    </div>
                  ))}
                  <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between font-semibold">
                    <span>Total Expenses</span>
                    <span className="text-red-600">{profitLoss.expenses.total}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-4">Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Income</span>
                    <span className="text-green-600">{profitLoss.income.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Expenses</span>
                    <span className="text-red-600">{profitLoss.expenses.total}</span>
                  </div>
                  <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between font-semibold">
                    <span>Net Profit</span>
                    <span className="text-brand-purple text-xl">{profitLoss.profit}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Income Trends</CardTitle>
            <CardDescription>Income patterns over time</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={monthlyData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#9b87f5" 
                  activeDot={{ r: 8 }}
                  name="Income" 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
