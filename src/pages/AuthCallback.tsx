
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // For API-based auth, check if we have a token in URL params or localStorage
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        
        if (token) {
          // Store the token and redirect to dashboard
          localStorage.setItem('authToken', token);
          navigate('/dashboard', { replace: true });
        } else {
          // Check if already authenticated
          const existingToken = localStorage.getItem('authToken');
          if (existingToken) {
            navigate('/dashboard', { replace: true });
          } else {
            navigate('/login', { replace: true });
          }
        }
      } catch (err: any) {
        console.error('Auth callback error:', err);
        setError(err.message || 'Authentication failed');
        // Redirect back to login page after a delay
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 max-w-md">
        {error ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-red-600">Authentication Error</h2>
            <p className="text-gray-600">{error}</p>
            <p className="text-sm text-gray-500">Redirecting to login page...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-brand-purple" />
            <h2 className="text-2xl font-bold text-gray-900">Completing authentication...</h2>
            <p className="text-gray-600">Please wait while we verify your credentials.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
