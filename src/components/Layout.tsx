import React from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { SessionTimeoutWarning } from "./SessionTimeoutWarning";

interface LayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  showFooter = true,
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={() => {}} />
      {children}
      {showFooter && <Footer />}
      <SessionTimeoutWarning />
    </div>
  );
};
