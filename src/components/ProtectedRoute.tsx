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
  const [visibilityReady, setVisibilityReady] = React.useState(true);
  const visibilityTimerRef = React.useRef<number | null>(null);
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
          console.log("Admin status check result:", adminStatus);
          setIsAdmin(adminStatus);
        } catch (error) {
          console.error("Error checking admin status:", error);
          setIsAdmin(false);
        } finally {
          setIsCheckingAdmin(false);
        }
      } else if (!requireAdmin) {
        // If admin access is not required, set isAdmin to true to allow access
        setIsAdmin(true);
        setIsCheckingAdmin(false);
      } else {
        // If user is not authenticated, reset admin status
        setIsAdmin(null);
        setIsCheckingAdmin(false);
      }
    };

    checkAdminStatus();
  }, [requireAdmin, isAuthenticated, user]);

  // Defer auth decisions briefly after tab becomes visible to avoid flicker/redirects
  React.useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        setVisibilityReady(false);
        if (visibilityTimerRef.current) {
          clearTimeout(visibilityTimerRef.current);
        }
        visibilityTimerRef.current = window.setTimeout(() => {
          setVisibilityReady(true);
          visibilityTimerRef.current = null;
        }, 200);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      if (visibilityTimerRef.current) {
        clearTimeout(visibilityTimerRef.current);
      }
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  if (isLoading || isCheckingSession || !visibilityReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  // Show loading while checking admin status
  if (requireAdmin && (isCheckingAdmin || isAdmin === null)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600">
          <span className="sr-only">Checking admin permissions...</span>
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
  if (requireAdmin && isAdmin !== true) {
    console.log("Admin check failed:", {
      requireAdmin,
      isAdmin,
      isCheckingAdmin,
    });
    console.log("Admin required but user is not admin, redirecting to profile");
    return <Navigate to="/profil" state={{ from: location }} replace />;
  }

  console.log("ProtectedRoute: Access granted", {
    requireAdmin,
    isAdmin,
    isAuthenticated,
  });
  return <>{children}</>;
};
