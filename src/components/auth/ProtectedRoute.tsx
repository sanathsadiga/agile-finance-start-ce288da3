
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const [shouldRender, setShouldRender] = useState(false);
  
  useEffect(() => {
    // Only update the state when loading is complete to prevent flickering
    if (!loading) {
      setShouldRender(true);
    }
  }, [loading, isAuthenticated]);
  
  // Show nothing until we're sure about authentication status
  if (loading || !shouldRender) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-purple"></div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Render children if authenticated
  return <>{children}</>;
};

export default ProtectedRoute;
