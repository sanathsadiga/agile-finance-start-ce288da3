
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, FileText, Users, Settings, LogOut, BarChart3, DollarSign, CreditCard, BookOpen, Star, UserCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminOperations = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if admin is logged in
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    toast({
      title: 'Logged out',
      description: 'You have been logged out from admin panel',
    });
    navigate('/admin/login');
  };

  const adminSections = [
    {
      title: 'Blog Management',
      description: 'Create, edit, delete and manage blog posts',
      icon: FileText,
      action: () => navigate('/blog/editor/blog'),
      color: 'bg-blue-500 hover:bg-blue-600',
      stats: '56 Posts'
    },
    {
      title: 'Documentation',
      description: 'Manage help docs and knowledge base',
      icon: BookOpen,
      action: () => toast({ title: 'Documentation Management', description: 'Documentation management interface' }),
      color: 'bg-indigo-500 hover:bg-indigo-600',
      stats: '23 Articles'
    },
    {
      title: 'User Management',
      description: 'View, edit and manage user accounts',
      icon: Users,
      action: () => toast({ title: 'User Management', description: 'User management interface' }),
      color: 'bg-green-500 hover:bg-green-600',
      stats: '1,234 Users'
    },
    {
      title: 'Employee Management',
      description: 'Manage internal staff and permissions',
      icon: UserCheck,
      action: () => toast({ title: 'Employee Management', description: 'Employee management interface' }),
      color: 'bg-teal-500 hover:bg-teal-600',
      stats: '15 Staff'
    },
    {
      title: 'Plans & Pricing',
      description: 'Manage subscription plans and pricing',
      icon: Star,
      action: () => toast({ title: 'Plans Management', description: 'Plans and pricing management interface' }),
      color: 'bg-yellow-500 hover:bg-yellow-600',
      stats: '3 Plans'
    },
    {
      title: 'Invoice Management',
      description: 'View and manage all user invoices',
      icon: CreditCard,
      action: () => toast({ title: 'Invoice Management', description: 'Invoice management interface' }),
      color: 'bg-purple-500 hover:bg-purple-600',
      stats: '2,456 Invoices'
    },
    {
      title: 'Expense Oversight',
      description: 'Monitor and manage platform expenses',
      icon: DollarSign,
      action: () => toast({ title: 'Expense Management', description: 'Expense management interface' }),
      color: 'bg-red-500 hover:bg-red-600',
      stats: '$45K Monthly'
    },
    {
      title: 'Analytics & Reports',
      description: 'View detailed analytics and reports',
      icon: BarChart3,
      action: () => toast({ title: 'Analytics Dashboard', description: 'Analytics and reporting interface' }),
      color: 'bg-orange-500 hover:bg-orange-600',
      stats: '15 Reports'
    },
    {
      title: 'System Settings',
      description: 'Configure system settings and preferences',
      icon: Settings,
      action: () => toast({ title: 'System Settings', description: 'System configuration interface' }),
      color: 'bg-gray-500 hover:bg-gray-600',
      stats: 'Healthy'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Helmet>
        <title>Admin Operations | FinanceFlow</title>
        <meta name="description" content="Admin operations panel for FinanceFlow" />
      </Helmet>

      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-red-500" />
              <div>
                <h1 className="text-2xl font-bold">Admin Operations Center</h1>
                <p className="text-gray-400 text-sm">FinanceFlow Control Panel</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome to Admin Control Center</h2>
          <p className="text-gray-400">Manage all aspects of your FinanceFlow platform from this centralized dashboard</p>
        </div>

        {/* Quick Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Users</p>
                  <p className="text-2xl font-bold text-white">1,234</p>
                  <p className="text-green-400 text-xs">+12% this month</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Subscriptions</p>
                  <p className="text-2xl font-bold text-white">892</p>
                  <p className="text-green-400 text-xs">+8% this month</p>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-white">$24,560</p>
                  <p className="text-green-400 text-xs">+15% this month</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">System Status</p>
                  <p className="text-2xl font-bold text-green-400">Healthy</p>
                  <p className="text-gray-400 text-xs">All systems operational</p>
                </div>
                <Settings className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Operation Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminSections.map((section, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-all duration-200 hover:shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${section.color}`}>
                    <section.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-white text-lg">{section.title}</CardTitle>
                    <CardDescription className="text-gray-400 text-sm">
                      {section.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-300 text-sm font-medium">{section.stats}</span>
                </div>
                <Button 
                  onClick={section.action}
                  className={`w-full ${section.color} text-white font-medium`}
                >
                  Manage {section.title}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity Section */}
        <div className="mt-12">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-xl">Recent System Activity</CardTitle>
              <CardDescription className="text-gray-400">Latest administrative actions and system events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: 'New user registration', user: 'john.doe@example.com', time: '2 minutes ago', type: 'user' },
                  { action: 'Blog post published', user: 'admin', time: '15 minutes ago', type: 'content' },
                  { action: 'Invoice payment received', user: 'Premium Plan', time: '1 hour ago', type: 'payment' },
                  { action: 'System backup completed', user: 'System', time: '3 hours ago', type: 'system' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-gray-700 last:border-b-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'user' ? 'bg-green-500' : 
                        activity.type === 'content' ? 'bg-blue-500' : 
                        activity.type === 'payment' ? 'bg-yellow-500' : 'bg-gray-500'
                      }`}></div>
                      <div>
                        <p className="text-white font-medium">{activity.action}</p>
                        <p className="text-gray-400 text-sm">by {activity.user}</p>
                      </div>
                    </div>
                    <span className="text-gray-400 text-sm">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminOperations;
