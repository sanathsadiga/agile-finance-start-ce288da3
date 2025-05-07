
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { checkSupabaseConnection, supabase, initializeDatabase } from "./lib/supabase/database";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Invoices from "./pages/Invoices";
import InvoiceDetail from "./pages/InvoiceDetail";
import InvoiceTemplateEditor from "./pages/InvoiceTemplateEditor";
import Expenses from "./pages/Expenses";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Aboutus from "./pages/aboutus";
import NotFound from "./pages/NotFound";
import ContactUs from "./pages/ContactUsPage";
import Blog from "./pages/BlogPage";
import Community from "./pages/Community";
import Documentation from "./pages/Documentation";
import AuthCallback from "./pages/AuthCallback";


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 60000,
    },
  },
});

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
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/invoices"
                element={
                  <ProtectedRoute>
                    <Invoices />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/invoices/:id"
                element={
                  <ProtectedRoute>
                    <InvoiceDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/templates"
                element={
                  <ProtectedRoute>
                    <InvoiceTemplateEditor />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/templates/:templateId"
                element={
                  <ProtectedRoute>
                    <InvoiceTemplateEditor />
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
              {/* Redirect deprecated routes to their dashboard counterparts */}
              <Route
                path="/invoices"
                element={<Navigate to="/dashboard/invoices" replace />}
              />
              <Route
                path="/expenses"
                element={<Navigate to="/dashboard/expenses" replace />}
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
              <Route path="/aboutus"
                element={<Aboutus />} />
              <Route path="/contactus"
                element={<ContactUs />} />
              <Route path="/blog"
                element={<Blog />} />
              <Route path="/blog/:slug"
                element={<Blog />} />
              <Route path="/community"
                element={<Community />} />
              <Route path="/documentation"
                element={<Documentation />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
