
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const RecentActivities = () => {
  const navigate = useNavigate();
  
  const activities = [
    {
      id: 1,
      date: 'Apr 25, 2025',
      description: 'Invoice #1234 paid',
      amount: '$2,500.00',
      status: 'Paid',
      statusColor: 'bg-green-100 text-green-800',
    },
    {
      id: 2,
      date: 'Apr 23, 2025',
      description: 'Software Subscription',
      amount: '-$99.00',
      status: 'Expense',
      statusColor: 'bg-red-100 text-red-800',
    },
    {
      id: 3,
      date: 'Apr 22, 2025',
      description: 'New invoice created',
      amount: '$1,750.00',
      status: 'Draft',
      statusColor: 'bg-blue-100 text-blue-800',
    },
    {
      id: 4,
      date: 'Apr 20, 2025',
      description: 'Invoice #1233 sent',
      amount: '$1,750.00',
      status: 'Pending',
      statusColor: 'bg-yellow-100 text-yellow-800',
    },
    {
      id: 5,
      date: 'Apr 18, 2025',
      description: 'Office supplies purchase',
      amount: '-$126.50',
      status: 'Expense',
      statusColor: 'bg-red-100 text-red-800',
    }
  ];

  return (
    <Card className="col-span-3">
      <CardHeader className="pb-3">
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-0">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-gray-50 transition-colors"
            >
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">{activity.description}</p>
                <p className="text-sm text-muted-foreground">{activity.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-sm font-medium ${activity.amount.startsWith('-') ? 'text-red-600' : 'text-gray-900'}`}>
                  {activity.amount}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${activity.statusColor}`}>
                  {activity.status}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4">
          <Button variant="outline" className="w-full" onClick={() => navigate('/invoices')}>
            View All Activity
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivities;
