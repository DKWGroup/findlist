import React, { useState } from "react";
import { AdminDashboard } from "../components/admin/AdminDashboard";
import { Layout } from "../components/Layout";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { SupabaseSetup } from "../components/upload/SupabaseSetup";
import { debugSession } from "../services/supabaseStorage"; 
import { isUserAdmin } from "../utils/adminUtils";

// Add debug logging
export const AdminPage: React.FC = () => {
  console.log("Rendering AdminPage");
  const [isAdmin, setIsAdmin] = useState(false);

  // Debug session state when admin page loads
  React.useEffect(() => {
    debugSession();
    
    // Check if user is admin
    const checkAdminStatus = async () => {
      const adminStatus = await isUserAdmin();
      setIsAdmin(adminStatus);
      
      if (!adminStatus) {
        console.warn("Non-admin user attempting to access admin page");
      }
    };
    
    checkAdminStatus();
  }, []);

  return (
    <ProtectedRoute requireAdmin>
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <SupabaseSetup />
          </div>
          <AdminDashboard />
        </div>
      </Layout>
    </ProtectedRoute>
  );
};
