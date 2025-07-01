
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Shield } from 'lucide-react';

interface AdminLoginFormData {
  email: string;
  password: string;
}

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<AdminLoginFormData>();
  
  const onSubmit = async (data: AdminLoginFormData) => {
    setLoading(true);
    try {
      // For now, we'll use a simple check - you can integrate with your backend later
      if (data.email === 'admin@financeflow.com' && data.password === 'admin123') {
        localStorage.setItem('adminToken', 'admin-logged-in');
        toast({
          title: 'Admin login successful',
          description: 'Welcome to admin panel',
        });
        navigate('/admin/operations');
      } else {
        toast({
          title: 'Login failed',
          description: 'Invalid admin credentials',
          variant: 'destructive',
        });
      }
    } catch (err) {
      toast({
        title: 'Login failed',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 p-4">
      <Helmet>
        <title>Admin Login | FinanceFlow</title>
        <meta name="description" content="Admin login for FinanceFlow" />
      </Helmet>
      
      <Card className="w-full max-w-md border-gray-700 bg-gray-800 text-white">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-red-500" />
              <span className="text-3xl font-bold text-white">Admin Panel</span>
            </div>
          </div>
          <CardTitle className="text-2xl text-center text-white">Admin Access</CardTitle>
          <CardDescription className="text-center text-gray-300">
            Enter your admin credentials to access the control panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-white">Admin Email</label>
              <Input
                id="email"
                placeholder="admin@financeflow.com"
                type="email"
                autoComplete="email"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                className={`bg-gray-700 border-gray-600 text-white ${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-white">Password</label>
              <div className="relative">
                <Input
                  id="password"
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  {...register('password', { required: 'Password is required' })}
                  className={`bg-gray-700 border-gray-600 text-white pr-10 ${errors.password ? 'border-red-500' : ''}`}
                />
                <button 
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? 
                    <EyeOff className="h-4 w-4" /> : 
                    <Eye className="h-4 w-4" />
                  }
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>
            
            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
              {loading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Signing in...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Admin Sign in
                </>
              )}
            </Button>
          </form>
          
          <div className="text-center text-sm mt-4">
            <Link to="/" className="font-medium text-gray-300 hover:text-white hover:underline">
              ← Back to main site
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
