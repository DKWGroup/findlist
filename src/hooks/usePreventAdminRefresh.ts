import { usePreventPageRefresh } from "./usePreventPageRefresh";

/**
 * Hook zapobiegający przypadkowemu odświeżeniu w panelu admina.
 * Wykorzystuje globalną logikę blokującą skróty odświeżania, bez dodatkowych efektów ubocznych.
 */
export const usePreventAdminRefresh = () => {
  usePreventPageRefresh();
};
