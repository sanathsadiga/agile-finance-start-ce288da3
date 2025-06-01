
import React from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import SummaryCards from '@/components/dashboard/SummaryCards';
import DashboardCharts from '@/components/dashboard/DashboardCharts';
import RecentActivities from '@/components/dashboard/RecentActivities';
import { useApiFinancialData } from '@/hooks/useApiFinancialData';

const Dashboard = () => {
  const { isLoading } = useApiFinancialData();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">Overview of your financial data</p>
          </div>
          
          <SummaryCards />
          
          <div className="grid gap-6 md:grid-cols-7">
            <DashboardCharts />
            <RecentActivities />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
