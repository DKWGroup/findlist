import React from "react";
import { Navigate } from "react-router-dom";
import { UserProfile } from "../components/profile/UserProfile";
import { useSimplifiedAuthContext } from "../contexts/SimplifiedAuthContext";

export const ProfilePage: React.FC = () => {
  const { user, isLoading } = useSimplifiedAuthContext();

  console.log("ProfilePage: Using simplified auth system");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/logowanie" replace />;
  }

  return <UserProfile />;
};
