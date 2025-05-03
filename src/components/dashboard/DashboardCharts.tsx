
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useFinancialData } from '@/hooks/useFinancialData';
import { useExpenses } from '@/hooks/useExpenses';

const DashboardCharts = () => {
  const [timePeriod, setTimePeriod] = useState('6months');
  const [chartType, setChartType] = useState('bar');
  const { calculateFinancialMetrics } = useFinancialData();
  const { monthlyData } = calculateFinancialMetrics();
  const { expenses } = useExpenses();
  
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
    })).sort((a, b) => b.amount - a.amount).slice(0, 6);
  }, [expenses]);

  // Filter data based on selected time period
  const filteredData = (() => {
    switch (timePeriod) {
      case '30days':
        return monthlyData.slice(-1);
      case '3months':
        return monthlyData.slice(-3);
      case '12months':
        return monthlyData; // Assumes we have 12 months of data
      default: // 6months
        return monthlyData.slice(-6);
    }
  })();

  // Custom tooltip formatter to display currency values
  const currencyFormatter = (value: number) => `$${value.toFixed(2)}`;

  return (
    <Card className="col-span-4">
      <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
        <CardTitle>Financial Overview</CardTitle>
        <div className="flex flex-wrap gap-2">
          <Tabs value={chartType} onValueChange={setChartType} className="w-[180px]">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="bar">Bar</TabsTrigger>
              <TabsTrigger value="line">Line</TabsTrigger>
            </TabsList>
          </Tabs>
          <Select 
            value={timePeriod} 
            onValueChange={setTimePeriod}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="3months">Last 3 months</SelectItem>
              <SelectItem value="6months">Last 6 months</SelectItem>
              <SelectItem value="12months">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="pl-2">
        {chartType === 'bar' ? (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={filteredData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={currencyFormatter} />
              <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
              <Legend />
              <Bar dataKey="revenue" fill="#9b87f5" name="Revenue" />
              <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
              <Bar dataKey="profit" fill="#10b981" name="Profit" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart
              data={filteredData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={currencyFormatter} />
              <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#9b87f5" name="Revenue" strokeWidth={2} />
              <Line type="monotone" dataKey="expenses" stroke="#ef4444" name="Expenses" strokeWidth={2} />
              <Line type="monotone" dataKey="profit" stroke="#10b981" name="Profit" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardCharts;
