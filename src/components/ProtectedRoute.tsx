import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { refreshTokenIfNeeded } from '../middleware/AuthMiddleware';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { isAuthenticated, user, isLoading, error } = useAuth();
  const [isCheckingSession, setIsCheckingSession] = React.useState(false);
  const location = useLocation();

  console.log('ProtectedRoute state:', { 
    isAuthenticated, 
    user: user ? `User ${user.id} (${user.role})` : 'No user', 
    isLoading, 
    requireAdmin,
    error
  });

  // Effect to refresh token if needed when component mounts
  React.useEffect(() => {
    const checkSession = async () => {
      if (isAuthenticated && user) {
        setIsCheckingSession(true);
        try {
          await refreshTokenIfNeeded();
        } catch (error) {
          console.error('Error refreshing token in ProtectedRoute:', error);
        } finally {
          setIsCheckingSession(false);
        }
      }
    };
    
    checkSession();
  }, [isAuthenticated, user]);

  if (isLoading || isCheckingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  // Check both authentication state and user object
  if (!isAuthenticated || !user) {
    console.log('Not authenticated or no user, redirecting to login');
    return <Navigate to="/logowanie" state={{ from: location }} replace />;
  }

  if (requireAdmin && user.role !== 'admin') {
    console.log('Admin required but user is not admin, redirecting to profile');
    return <Navigate to="/profil" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};