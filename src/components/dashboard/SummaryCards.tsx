
import React from 'react';
import { DollarSign, TrendingUp, CreditCard, ArrowDownRight, ArrowUpRight } from "lucide-react";

const SummaryCards = () => {
  // This would normally fetch data from an API
  const summaryData = {
    outstandingInvoices: { value: 12500, change: 8.2, isPositive: true },
    totalRevenue: { value: 48500, change: 12.7, isPositive: true },
    totalExpenses: { value: 27500, change: 4.3, isPositive: false },
    netProfit: { value: 21000, change: 15.8, isPositive: true }
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
        <p className="text-2xl font-bold mt-2">${summaryData.outstandingInvoices.value.toLocaleString()}</p>
        <div className="flex items-center mt-2 text-xs">
          {summaryData.outstandingInvoices.isPositive ? (
            <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
          ) : (
            <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
          )}
          <span className={summaryData.outstandingInvoices.isPositive ? 'text-green-500' : 'text-red-500'}>
            {summaryData.outstandingInvoices.change}%
          </span>
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
        <p className="text-2xl font-bold mt-2">${summaryData.totalRevenue.toLocaleString()}</p>
        <div className="flex items-center mt-2 text-xs">
          {summaryData.totalRevenue.isPositive ? (
            <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
          ) : (
            <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
          )}
          <span className={summaryData.totalRevenue.isPositive ? 'text-green-500' : 'text-red-500'}>
            {summaryData.totalRevenue.change}%
          </span>
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
        <p className="text-2xl font-bold mt-2">${summaryData.totalExpenses.toLocaleString()}</p>
        <div className="flex items-center mt-2 text-xs">
          {!summaryData.totalExpenses.isPositive ? (
            <ArrowDownRight className="h-3 w-3 text-green-500 mr-1" />
          ) : (
            <ArrowUpRight className="h-3 w-3 text-red-500 mr-1" />
          )}
          <span className={!summaryData.totalExpenses.isPositive ? 'text-green-500' : 'text-red-500'}>
            {summaryData.totalExpenses.change}%
          </span>
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
        <p className="text-2xl font-bold mt-2">${summaryData.netProfit.toLocaleString()}</p>
        <div className="flex items-center mt-2 text-xs">
          {summaryData.netProfit.isPositive ? (
            <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
          ) : (
            <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
          )}
          <span className={summaryData.netProfit.isPositive ? 'text-green-500' : 'text-red-500'}>
            {summaryData.netProfit.change}%
          </span>
          <span className="text-gray-500 ml-1">from last month</span>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
