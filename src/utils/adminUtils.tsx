import React from "react";
import { supabase } from "../services/supabaseStorage";

/**
 * Check if the current user has admin role
 * @returns Promise<boolean> True if user is admin, false otherwise
 */
export const isUserAdmin = async (): Promise<boolean> => {
  // Admin role ID from the database
  const ADMIN_ROLE_ID = "4fc5fbc4-927a-46ff-9afa-9692fe7a6e6f";
  return await userHasRole(ADMIN_ROLE_ID);
};

/**
 * Check if the current user has a specific role
 * @param roleId The UUID of the role to check
 * @returns Promise<boolean> True if user has the role, false otherwise
 */
export const userHasRole = async (roleId: string): Promise<boolean> => {
  try {
    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user) {
      console.error("Error getting user:", userError);
      return false;
    }

    // Check if user has the specific role through user_role_assignments
    const { data, error } = await supabase
      .from("user_role_assignments")
      .select("id")
      .eq("user_id", userData.user.id)
      .eq("role_id", roleId)
      .eq("is_active", true)
      .maybeSingle();

    if (error) {
      console.error("Error checking user role:", error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error("Error in userHasRole:", error);
    return false;
  }
};

/**
 * Higher-order function to protect admin routes
 * @param Component The component to render if user is admin
 * @param fallback The component to render if user is not admin
 * @returns A component that renders Component if user is admin, fallback otherwise
 */
export const withAdminAccess = (
  Component: React.ComponentType,
  Fallback: React.ComponentType
) => {
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

    return isAdmin ? <Component {...props} /> : <Fallback {...props} />;
  };
};
