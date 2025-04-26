
import React from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';

const Dashboard = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <DashboardHeader />
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Dashboard content */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-medium text-gray-500">Outstanding Invoices</h3>
            <p className="text-2xl font-bold mt-1">$12,500</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-medium text-gray-500">Total Revenue</h3>
            <p className="text-2xl font-bold mt-1">$48,500</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-medium text-gray-500">Total Expenses</h3>
            <p className="text-2xl font-bold mt-1">$27,500</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-medium text-gray-500">Net Profit</h3>
            <p className="text-2xl font-bold mt-1">$21,000</p>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Apr 25, 2025</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Invoice #1234</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$2,500.00</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Paid</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Apr 23, 2025</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Software Subscription</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-$99.00</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Expense</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Apr 20, 2025</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Invoice #1233</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$1,750.00</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
