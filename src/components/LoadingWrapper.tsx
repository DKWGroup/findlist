import React from "react";
import { useSimplifiedAuthContext } from "../contexts/SimplifiedAuthContext";

interface LoadingWrapperProps {
  children: React.ReactNode;
}

export const LoadingWrapper: React.FC<LoadingWrapperProps> = ({ children }) => {
  // Safe auth hook usage with error handling
  let isLoading = true;
  let isAuthenticated = false;
  let user = null;

  try {
    const auth = useSimplifiedAuthContext();
    isLoading = auth.isLoading;
    isAuthenticated = auth.isAuthenticated;
    user = auth.user;
  } catch (error) {
    // AuthProvider context not available, use defaults
    console.warn("AuthProvider not ready in LoadingWrapper, using defaults");
    isLoading = false; // Don't show loading if context is not available
  }

  const [timeoutReached, setTimeoutReached] = React.useState(false);

  // Debug logging
  React.useEffect(() => {
    console.log("LoadingWrapper state:", {
      isLoading,
      isAuthenticated,
      user: user ? `User ${user.id}` : "No user",
    });
  }, [isLoading, isAuthenticated, user]);

  // Timeout fallback - if loading takes too long, show content anyway
  React.useEffect(() => {
    if (isLoading) {
      const timeout = setTimeout(() => {
        console.log("LoadingWrapper: Timeout reached, forcing content display");
        setTimeoutReached(true);
      }, 5000); // 5 seconds timeout

      return () => clearTimeout(timeout);
    } else {
      setTimeoutReached(false);
    }
  }, [isLoading]);

  if (isLoading && !timeoutReached) {
    console.log("LoadingWrapper: Showing loading state");
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Ładowanie...</p>
        </div>
      </div>
    );
  }

  if (timeoutReached) {
    console.log(
      "LoadingWrapper: Timeout reached, showing content despite loading state"
    );
  } else {
    console.log("LoadingWrapper: Showing content");
  }

  return <>{children}</>;
};
