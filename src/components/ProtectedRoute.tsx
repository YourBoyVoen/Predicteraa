import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { authApi, ApiError } from '../services';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      // No tokens at all - not authenticated
      if (!accessToken && !refreshToken) {
        setIsAuthenticated(false);
        return;
      }

      // Has access token - assume valid for now
      if (accessToken) {
        setIsAuthenticated(true);
        return;
      }

      // Only has refresh token - try to refresh
      if (refreshToken) {
        try {
          const response = await authApi.refreshToken({ refreshToken });
          localStorage.setItem('accessToken', response.data.accessToken);
          setIsAuthenticated(true);
        } catch (error) {
          // Refresh failed - clear everything
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          setIsAuthenticated(false);
        }
      }
    };

    checkAuth();
  }, []);

  // Still checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Authenticated - render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
