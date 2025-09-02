import { useCallback, useEffect, useState } from "react";
import { useSimplifiedAuthContext } from "../contexts/SimplifiedAuthContext";
// import { refreshTokenIfNeeded } from "../middleware/AuthMiddleware"; // DISABLED FOR DEBUGGING
import { supabase } from "../services/supabaseStorage";
import { isSessionExpired } from "../utils/sessionPersistence";

interface UseSessionTimeoutOptions {
  timeoutMinutes?: number;
  warningMinutes?: number;
  onTimeout?: () => void;
  onWarning?: () => void;
}

export const useSessionTimeout = (options: UseSessionTimeoutOptions = {}) => {
  const {
    timeoutMinutes = 30,
    warningMinutes = 5,
    onTimeout,
    onWarning,
  } = options;

  const { isAuthenticated, logout } = useSimplifiedAuthContext();
  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [isTabVisible, setIsTabVisible] = useState(true);

  // Reset activity timer on user interaction
  const resetActivityTimer = useCallback(() => {
    setLastActivity(Date.now());
    setShowWarning(false);
  }, []);

  // Check session status and handle timeout
  const checkSession = useCallback(async () => {
    if (!isAuthenticated || !isTabVisible) return;

    try {
      // Check if session is expired
      const expired = isSessionExpired();

      // Get current session to check expiration time
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        const expiresAt = new Date(
          (data.session.expires_at || 0) * 1000
        ).getTime();
        const now = Date.now();
        const minutesLeft = Math.round((expiresAt - now) / 60000);
        console.log(`Session expires in: ${minutesLeft} minutes`);
      }

      if (expired) {
        // Session expired, log out
        setShowWarning(false);
        onTimeout?.();
        await logout();
        return;
      }

      // Only check inactivity timeout if tab is visible
      if (isTabVisible) {
        // Check inactivity timeout
        const inactiveTime = (Date.now() - lastActivity) / (60 * 1000); // in minutes

        if (inactiveTime >= timeoutMinutes) {
          // User inactive for too long, log out
          setShowWarning(false);
          onTimeout?.();
          await logout();
        } else if (inactiveTime >= timeoutMinutes - warningMinutes) {
          // Show warning before timeout
          if (!showWarning) {
            setShowWarning(true);
            onWarning?.();
          }

          // Calculate time remaining
          const remaining = Math.max(0, timeoutMinutes - inactiveTime);
          setTimeRemaining(Math.round(remaining));
        } else {
          setShowWarning(false);
          setTimeRemaining(null);
        }
      }

      // Refresh token if needed - DISABLED FOR DEBUGGING
      console.log(
        "useSessionTimeout: SKIPPING refreshTokenIfNeeded() for debug"
      );
      // console.log("useSessionTimeout: About to call refreshTokenIfNeeded()");
      // await refreshTokenIfNeeded();
      // console.log("useSessionTimeout: refreshTokenIfNeeded() completed");
    } catch (error) {
      console.error("Error checking session:", error);
    }
  }, [
    isAuthenticated,
    isTabVisible,
    lastActivity,
    logout,
    onTimeout,
    onWarning,
    showWarning,
    timeoutMinutes,
    warningMinutes,
  ]);

  // Set up activity listeners
  useEffect(() => {
    if (!isAuthenticated) return;

    // User activity events to track
    const activityEvents = [
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
      "click",
    ];

    // Handle page visibility change to pause/resume activity tracking
    const handleVisibilityChange = () => {
      const isVisible = document.visibilityState === "visible";
      setIsTabVisible(isVisible);

      if (isVisible) {
        // Reset activity timer when user returns to the tab
        resetActivityTimer();
        console.log("Tab became visible - resetting activity timer");
      } else {
        console.log("Tab became hidden - pausing inactivity checks");
      }
    };

    // Add event listeners
    activityEvents.forEach((event) => {
      window.addEventListener(event, resetActivityTimer);
    });

    // Listen for visibility changes to prevent false timeouts
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Set up interval to check session
    const interval = setInterval(() => {
      // Don't check for timeout if tab is not visible
      if (document.visibilityState === "visible") {
        checkSession();
      }
    }, 60 * 1000); // Check every minute

    // Initial check
    checkSession();

    // Cleanup
    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, resetActivityTimer);
      });
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInterval(interval);
    };
  }, [isAuthenticated, checkSession, resetActivityTimer]);

  // Extend session manually
  const extendSession = useCallback(async () => {
    resetActivityTimer();
    // await refreshTokenIfNeeded(); // DISABLED FOR DEBUGGING
    console.log("extendSession: SKIPPING refreshTokenIfNeeded() for debug");
    setShowWarning(false);
  }, [resetActivityTimer]);

  return {
    showWarning,
    timeRemaining,
    extendSession,
  };
};
