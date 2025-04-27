
import React from 'react';
import { DollarSign, TrendingUp, CreditCard, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useFinancialData } from '@/hooks/useFinancialData';

const SummaryCards = () => {
  const { calculateFinancialMetrics } = useFinancialData();
  const { summary } = calculateFinancialMetrics();

  // Calculate month-over-month changes
  const changePercentages = {
    outstandingInvoices: 8.2, // These would be calculated from historical data in a real app
    totalRevenue: 12.7,
    totalExpenses: 4.3,
    netProfit: 15.8
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-500">Outstanding Invoices</h3>
          <div className="p-2 rounded-full bg-blue-50">
            <DollarSign className="h-4 w-4 text-blue-500" />
          </div>
        </div>
        <p className="text-2xl font-bold mt-2">${summary.outstandingInvoices.toLocaleString()}</p>
        <div className="flex items-center mt-2 text-xs">
          <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
          <span className="text-green-500">{changePercentages.outstandingInvoices}%</span>
          <span className="text-gray-500 ml-1">from last month</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-500">Total Revenue</h3>
          <div className="p-2 rounded-full bg-green-50">
            <DollarSign className="h-4 w-4 text-green-500" />
          </div>
        </div>
        <p className="text-2xl font-bold mt-2">${summary.totalRevenue.toLocaleString()}</p>
        <div className="flex items-center mt-2 text-xs">
          <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
          <span className="text-green-500">{changePercentages.totalRevenue}%</span>
          <span className="text-gray-500 ml-1">from last month</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-500">Total Expenses</h3>
          <div className="p-2 rounded-full bg-red-50">
            <CreditCard className="h-4 w-4 text-red-500" />
          </div>
        </div>
        <p className="text-2xl font-bold mt-2">${summary.totalExpenses.toLocaleString()}</p>
        <div className="flex items-center mt-2 text-xs">
          <ArrowDownRight className="h-3 w-3 text-green-500 mr-1" />
          <span className="text-green-500">{changePercentages.totalExpenses}%</span>
          <span className="text-gray-500 ml-1">from last month</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-500">Net Profit</h3>
          <div className="p-2 rounded-full bg-purple-50">
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </div>
        </div>
        <p className="text-2xl font-bold mt-2">${summary.netProfit.toLocaleString()}</p>
        <div className="flex items-center mt-2 text-xs">
          <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
          <span className="text-green-500">{changePercentages.netProfit}%</span>
          <span className="text-gray-500 ml-1">from last month</span>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
