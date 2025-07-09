import React from 'react';
import { Link } from 'react-router-dom';
import { ResetPasswordForm } from '../components/auth/ResetPasswordForm';

export const ResetPasswordPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <img 
              src="/viralist-logo2.png" 
              alt="VIRALIST" 
              className="h-8 w-auto"
            />
          </Link>
        </div>

        <ResetPasswordForm />

        {/* Back to home */}
        <div className="mt-8 text-center">
          <Link to="/" className="text-blue-600 hover:text-blue-700 text-sm">
            ← Wróć do strony głównej
          </Link>
        </div>
      </div>
    </div>
  );
};