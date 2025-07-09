import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { isSessionExpired } from '../utils/sessionPersistence';
import { refreshTokenIfNeeded } from '../middleware/AuthMiddleware';
import { supabase } from '../services/supabaseStorage';

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
    onWarning
  } = options;
  
  const { isAuthenticated, logout } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [lastActivity, setLastActivity] = useState(Date.now());
  
  // Reset activity timer on user interaction
  const resetActivityTimer = useCallback(() => {
    setLastActivity(Date.now());
    setShowWarning(false);
  }, []);
  
  // Check session status and handle timeout
  const checkSession = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      // Check if session is expired
      const expired = isSessionExpired();
      
      // Get current session to check expiration time
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        const expiresAt = new Date(data.session.expires_at * 1000 || 0).getTime();
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
      
      // Check inactivity timeout
      const inactiveTime = (Date.now() - lastActivity) / (60 * 1000); // in minutes
      
      if (inactiveTime >= timeoutMinutes) {
        // User inactive for too long, log out
        setShowWarning(false);
        onTimeout?.();
        await logout();
      } else if (inactiveTime >= (timeoutMinutes - warningMinutes)) {
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
      
      // Refresh token if needed
      await refreshTokenIfNeeded();
    } catch (error) {
      console.error('Error checking session:', error);
    }
  }, [isAuthenticated, lastActivity, logout, onTimeout, onWarning, showWarning, timeoutMinutes, warningMinutes]);
  
  // Set up activity listeners
  useEffect(() => {
    if (!isAuthenticated) return;
    
    // User activity events to track
    const activityEvents = [
      'mousedown',
      'keydown',
      'scroll',
      'touchstart',
      'click'
    ];
    
    // Add event listeners
    activityEvents.forEach(event => {
      window.addEventListener(event, resetActivityTimer);
    });
    
    // Set up interval to check session
    const interval = setInterval(checkSession, 60 * 1000); // Check every minute
    
    // Initial check
    checkSession();
    
    // Cleanup
    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, resetActivityTimer);
      });
      clearInterval(interval);
    };
  }, [isAuthenticated, checkSession, resetActivityTimer]);
  
  // Extend session manually
  const extendSession = useCallback(async () => {
    resetActivityTimer();
    await refreshTokenIfNeeded();
    setShowWarning(false);
  }, [resetActivityTimer]);
  
  return {
    showWarning,
    timeRemaining,
    extendSession
  };
};