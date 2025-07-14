import React from 'react';
import { supabase } from '../services/supabaseStorage';

/**
 * Check if the current user has admin role
 * @returns Promise<boolean> True if user is admin, false otherwise
 */
export const isUserAdmin = async (): Promise<boolean> => {
  try {
    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      console.error('Error getting user:', userError);
      return false;
    }
    
    // Check if user has admin role using the user_role_assignments table
    const { data, error } = await supabase.rpc('user_has_role_simple', {
      user_uuid: userData.user.id,
      role_name: 'admin'
    });
    
    if (error) {
      console.error('Error checking admin role:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error in isUserAdmin:', error);
    return false;
  }
};

/**
 * Higher-order function to protect admin routes
 * @param Component The component to render if user is admin
 * @param fallback The component to render if user is not admin
 * @returns A component that renders Component if user is admin, fallback otherwise
 */
export const withAdminAccess = (Component: React.ComponentType, fallback: React.ComponentType) => {
  return (props: any) => {
    const [isAdmin, setIsAdmin] = React.useState<boolean | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    
    React.useEffect(() => {
      const checkAdminStatus = async () => {
        const adminStatus = await isUserAdmin();
        setIsAdmin(adminStatus);
        setIsLoading(false);
      };
      
      checkAdminStatus();
    }, []);
    
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }
    
    return isAdmin ? <Component {...props} /> : <fallback {...props} />;
  };
};