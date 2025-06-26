
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SignupDetails from "./pages/SignupDetails";
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
import BlogDetail from "./pages/BlogDetail";
import BlogEditor from "./pages/BlogEditor";
import Community from "./pages/Community";
import Documentation from "./pages/Documentation";
import ScrollToTop from './components/ScrollToTop';
import PricingPage from './pages/pricingpage';
import FeaturesPage from './pages/features';
import Customers from "./pages/Customers";
import InvoicePayment from "./pages/InvoicePayment";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailed from "./pages/PaymentFailed";

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
    console.log('App initialized with API-based backend');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/signup/details" element={<SignupDetails />} />
              
              {/* Payment routes - public access */}
              <Route path="/payment/pay/invoice/:publicId" element={<InvoicePayment />} />
              <Route path="/payment/pay/invoice/:publicId/received/payment-success" element={<PaymentSuccess />} />
              <Route path="/payment/pay/invoice/:publicId/failed/payment-failed" element={<PaymentFailed />} />
              
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/customers"
                element={
                  <ProtectedRoute>
                    <Customers />
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
              <Route path="/aboutus" element={<Aboutus />} />
              <Route path="/contactus" element={<ContactUs />} />
              
              {/* Blog routes */}
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogDetail />} />
              <Route path="/editor/blogs/new" element={<BlogEditor />} />
              <Route path="/editor/blogs/:id" element={<BlogEditor />} />
              
              <Route path="/community" element={<Community />} />
              <Route path="/documentation" element={<Documentation />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/features" element={<FeaturesPage />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
