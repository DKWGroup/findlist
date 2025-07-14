import React, { createContext, useContext } from "react";
import { useSimplifiedAuth } from "../hooks/useSimplifiedAuth";

const SimplifiedAuthContext = createContext<
  ReturnType<typeof useSimplifiedAuth> | undefined
>(undefined);

export const useSimplifiedAuthContext = () => {
  const context = useContext(SimplifiedAuthContext);
  if (context === undefined) {
    throw new Error(
      "useSimplifiedAuthContext must be used within a SimplifiedAuthProvider"
    );
  }
  return context;
};

interface SimplifiedAuthProviderProps {
  children: React.ReactNode;
}

export const SimplifiedAuthProvider: React.FC<SimplifiedAuthProviderProps> = ({
  children,
}) => {
  const auth = useSimplifiedAuth();

  return (
    <SimplifiedAuthContext.Provider value={auth}>
      {children}
    </SimplifiedAuthContext.Provider>
  );
};
