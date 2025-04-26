
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  FileText, 
  FileMinus,
  BarChart
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatsCard from '@/components/stats/StatsCard';

// Placeholder data for the dashboard
const dashboardData = {
  totalIncome: "$12,450",
  totalExpenses: "$4,890",
  profit: "$7,560",
  outstandingInvoices: "$3,200",
  recentActivity: [
    {
      id: 1,
      type: "invoice",
      title: "Invoice #1234 created",
      amount: "$1,200",
      date: "2023-04-25",
    },
    {
      id: 2,
      type: "payment",
      title: "Payment received",
      amount: "$980",
      date: "2023-04-24",
    },
    {
      id: 3,
      type: "expense",
      title: "Software subscription",
      amount: "$49.99",
      date: "2023-04-22",
    },
    {
      id: 4,
      type: "invoice",
      title: "Invoice #1233 created",
      amount: "$2,500",
      date: "2023-04-20",
    },
    {
      id: 5,
      type: "expense",
      title: "Office supplies",
      amount: "$126.50",
      date: "2023-04-18",
    },
  ],
  quickLinks: [
    {
      title: "Create Invoice",
      icon: <FileText className="h-5 w-5" />,
      path: "/invoices"
    },
    {
      title: "Record Expense",
      icon: <FileMinus className="h-5 w-5" />,
      path: "/expenses"
    },
    {
      title: "View Reports",
      icon: <BarChart className="h-5 w-5" />,
      path: "/reports"
    },
  ]
};

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Here's an overview of your financial status</p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard 
            title="Total Income" 
            value={dashboardData.totalIncome} 
            icon={<DollarSign className="h-5 w-5 text-brand-purple" />}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard 
            title="Total Expenses" 
            value={dashboardData.totalExpenses} 
            icon={<DollarSign className="h-5 w-5 text-brand-purple" />}
            trend={{ value: 5, isPositive: false }}
          />
          <StatsCard 
            title="Profit" 
            value={dashboardData.profit} 
            icon={<DollarSign className="h-5 w-5 text-brand-purple" />}
            trend={{ value: 8, isPositive: true }}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest financial transactions</CardDescription>
                </div>
                <Button variant="outline" size="sm">View all</Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="flex items-start">
                        <div className={`p-2 rounded-md mr-4 ${
                          activity.type === 'invoice' 
                            ? 'bg-blue-50 text-blue-600' 
                            : activity.type === 'payment' 
                            ? 'bg-green-50 text-green-600' 
                            : 'bg-orange-50 text-orange-600'
                        }`}>
                          {activity.type === 'invoice' ? (
                            <FileText className="h-5 w-5" />
                          ) : activity.type === 'payment' ? (
                            <ArrowUpRight className="h-5 w-5" />
                          ) : (
                            <ArrowDownRight className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-sm text-gray-500">{activity.date}</p>
                        </div>
                      </div>
                      <p className={`font-medium ${
                        activity.type === 'expense' ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {activity.type === 'expense' ? '-' : '+'}{activity.amount}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Outstanding Invoices</CardTitle>
                <CardDescription>Total unpaid invoices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">{dashboardData.outstandingInvoices}</div>
                <Link to="/invoices">
                  <Button variant="outline" size="sm" className="w-full">
                    View invoices
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Frequently used features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {dashboardData.quickLinks.map((link, index) => (
                    <Link to={link.path} key={index}>
                      <Button variant="outline" className="w-full justify-start">
                        <span className="mr-2">{link.icon}</span>
                        {link.title}
                      </Button>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
