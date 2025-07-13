import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { SessionTimeoutWarning } from './SessionTimeoutWarning';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, showFooter = true }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={() => {}} />
      {children}
      {showFooter && <Footer />}
      {isAuthenticated && <SessionTimeoutWarning />}
    </div>
  );
};