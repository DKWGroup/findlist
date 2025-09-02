import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Uproszczony hook zapobiegający przypadkowemu odświeżeniu strony
 * Tylko dla stron innych niż logowanie/rejestracja
 */
export const usePreventPageRefreshSimple = () => {
  const location = useLocation();

  useEffect(() => {
    // Nie działaj na stronach auth
    const authPages = [
      "/logowanie",
      "/rejestracja",
      "/reset-hasla",
      "/update-password",
      "/verification-required",
    ];
    if (authPages.includes(location.pathname)) {
      return;
    }

    // Tylko podstawowa ochrona przed F5/Ctrl+R w formularzach
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F5" || (e.ctrlKey && e.key === "r")) {
        const isInForm = (e.target as Element)?.closest("form");
        if (isInForm) {
          const hasUnsavedData = isInForm.querySelector(
            "input[value], textarea[value]"
          );
          if (
            hasUnsavedData &&
            !window.confirm(
              "Czy na pewno chcesz odświeżyć stronę? Niezapisane zmiany zostaną utracone."
            )
          ) {
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [location.pathname]);
};
