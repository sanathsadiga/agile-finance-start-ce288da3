import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { checkSupabaseConnection, supabase, initializeDatabase } from "./lib/supabase/database";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Invoices from "./pages/Invoices";
import Expenses from "./pages/Expenses";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Check Supabase connection and initialize database on app startup
    const checkConnection = async () => {
      console.log('Supabase object:', supabase ? 'Initialized' : 'Not initialized');
      
      try {
        const isConnected = await checkSupabaseConnection();
        if (isConnected) {
          console.log('✅ Supabase connection successful!');
          // Initialize database and check RLS policies
          await initializeDatabase();
        } else {
          console.error('❌ Supabase connection failed. Check your environment variables.');
        }
      } catch (error) {
        console.error('Error during connection check:', error);
      }
    };
    
    checkConnection();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/invoices" 
                element={
                  <ProtectedRoute>
                    <Invoices />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/expenses" 
                element={
                  <ProtectedRoute>
                    <Expenses />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/expenses" 
                element={
                  <ProtectedRoute>
                    <Expenses />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/reports" 
                element={
                  <ProtectedRoute>
                    <Reports />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
