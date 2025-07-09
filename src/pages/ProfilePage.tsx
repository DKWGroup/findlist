import React from 'react';
import { Layout } from '../components/Layout';
import { UserProfile } from '../components/profile/UserProfile';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { refreshTokenIfNeeded } from '../middleware/AuthMiddleware';

export const ProfilePage: React.FC = () => {
  // Refresh token when profile page loads
  React.useEffect(() => {
    refreshTokenIfNeeded();
  }, []);

  return (
    <ProtectedRoute>
      <Layout showFooter={false}>
        <UserProfile />
      </Layout>
    </ProtectedRoute>
  );
};