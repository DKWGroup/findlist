import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSimplifiedAuthContext } from "../contexts/SimplifiedAuthContext";
import { isUserAdmin } from "../utils/adminUtils";
// import { refreshTokenIfNeeded } from '../middleware/AuthMiddleware'; // DISABLED FOR DEBUGGING

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false,
}) => {
  const { isAuthenticated, user, isLoading } = useSimplifiedAuthContext();
  const [isAdmin, setIsAdmin] = React.useState<boolean | null>(null);
  const [isCheckingAdmin, setIsCheckingAdmin] = React.useState(false);
  const [isCheckingSession, setIsCheckingSession] = React.useState(false);
  const location = useLocation();

  console.log("ProtectedRoute state:", {
    isAuthenticated,
    user: user ? `User ${user.id} (${user.email})` : "No user",
    isLoading,
    requireAdmin,
  });

  // Effect to refresh token if needed when component mounts
  React.useEffect(() => {
    const checkSession = async () => {
      if (isAuthenticated && user) {
        setIsCheckingSession(true);
        try {
          console.log(
            "ProtectedRoute: SKIPPING refreshTokenIfNeeded() for debug"
          );
          // console.log("ProtectedRoute: About to call refreshTokenIfNeeded()");
          // await refreshTokenIfNeeded();
          // console.log("ProtectedRoute: refreshTokenIfNeeded() completed");
        } catch (error) {
          console.error("Error refreshing token in ProtectedRoute:", error);
        } finally {
          setIsCheckingSession(false);
        }
      }
    };

    checkSession();
  }, [isAuthenticated, user]);

  // Check admin status if required
  React.useEffect(() => {
    const checkAdminStatus = async () => {
      if (requireAdmin && isAuthenticated && user) {
        setIsCheckingAdmin(true);
        try {
          const adminStatus = await isUserAdmin();
          setIsAdmin(adminStatus);
        } catch (error) {
          console.error("Error checking admin status:", error);
          setIsAdmin(false);
        } finally {
          setIsCheckingAdmin(false);
        }
      }
    };

    checkAdminStatus();
  }, [requireAdmin, isAuthenticated, user]);

  if (isLoading || isCheckingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  // Show loading while checking admin status
  if (requireAdmin && isCheckingAdmin) {
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
    console.log("Not authenticated or no user, redirecting to login");
    return <Navigate to="/logowanie" state={{ from: location }} replace />;
  }

  // Check admin status from database
  if (requireAdmin && !isAdmin) {
    console.log("Admin required but user is not admin, redirecting to profile");
    return <Navigate to="/profil" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
