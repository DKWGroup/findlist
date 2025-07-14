import React, { useState } from "react";
import { AdminDashboard } from "../components/admin/AdminDashboard";
import { Layout } from "../components/Layout";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { SupabaseSetup } from "../components/upload/SupabaseSetup";
import { debugSession } from "../services/supabaseStorage"; 
import { productService } from "../services/productService";
import { isUserAdmin } from "../utils/adminUtils";

// Add debug logging
export const AdminPage: React.FC = () => {
  console.log("Rendering AdminPage");
  const [isAdmin, setIsAdmin] = useState(false);

  // Debug session state when admin page loads
  React.useEffect(() => {
    debugSession();
    
    const checkAdminStatus = async () => {
        // Check admin status - product list is managed by AdminDashboard
        console.log('Admin page loaded');
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
