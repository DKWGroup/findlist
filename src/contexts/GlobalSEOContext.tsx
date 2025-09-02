import React, { createContext, ReactNode, useContext } from "react";

interface GlobalSEOConfig {
  siteName: string;
  siteUrl: string;
  defaultImage: string;
  defaultDescription: string;
  twitterHandle: string;
  facebookAppId?: string;
  googleAnalyticsId?: string;
  googleTagManagerId?: string;
}

const defaultGlobalSEO: GlobalSEOConfig = {
  siteName: "VIRALIST",
  siteUrl: "https://findlist.net",
  defaultImage: "https://findlist.net/og-image.png",
  defaultDescription:
    "Odkryj najgorętsze trendy zakupowe z TikToka i Instagrama! VIRALIST to katalog viralowych produktów, recenzji i inspiracji.",
  twitterHandle: "@findlist_pl",
  facebookAppId: undefined,
  googleAnalyticsId: undefined,
  googleTagManagerId: undefined,
};

const GlobalSEOContext = createContext<GlobalSEOConfig>(defaultGlobalSEO);

interface GlobalSEOProviderProps {
  children: ReactNode;
  config?: Partial<GlobalSEOConfig>;
}

export const GlobalSEOProvider: React.FC<GlobalSEOProviderProps> = ({
  children,
  config = {},
}) => {
  const mergedConfig = { ...defaultGlobalSEO, ...config };

  return (
    <GlobalSEOContext.Provider value={mergedConfig}>
      {children}
    </GlobalSEOContext.Provider>
  );
};

export const useGlobalSEO = () => {
  const context = useContext(GlobalSEOContext);
  if (!context) {
    throw new Error("useGlobalSEO must be used within a GlobalSEOProvider");
  }
  return context;
};
