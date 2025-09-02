import { useCallback, useEffect, useState } from "react";

interface PageStateManager {
  hasUnsavedChanges: boolean;
  markAsModified: () => void;
  markAsSaved: () => void;
  confirmNavigation: (message?: string) => boolean;
}

/**
 * Hook zarządzający stanem strony i zapobiegający przypadkowym odświeżeniom
 */
export const usePageState = (): PageStateManager => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Oznacz stronę jako zmodyfikowaną
  const markAsModified = useCallback(() => {
    setHasUnsavedChanges(true);
  }, []);

  // Oznacz stronę jako zapisaną
  const markAsSaved = useCallback(() => {
    setHasUnsavedChanges(false);
  }, []);

  // Potwierdź nawigację
  const confirmNavigation = useCallback(
    (
      message = "Masz niezapisane zmiany. Czy na pewno chcesz opuścić stronę?"
    ) => {
      if (hasUnsavedChanges) {
        return window.confirm(message);
      }
      return true;
    },
    [hasUnsavedChanges]
  );

  // Zapobiegaj przypadkowemu zamknięciu strony z niezapisanymi zmianami
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue =
          "Masz niezapisane zmiany. Czy na pewno chcesz opuścić stronę?";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  // Obsługa zmiany widoczności karty
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log("Tab became visible - checking for conflicts");
        // Tu można dodać logikę sprawdzania czy dane nie zostały zmienione w międzyczasie
      } else {
        console.log("Tab became hidden - preserving state");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Obsługa kombinacji klawiszy do odświeżania
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Zapobiegaj F5 i Ctrl+R gdy są niezapisane zmiany
      if (
        (e.key === "F5" || (e.ctrlKey && e.key === "r")) &&
        hasUnsavedChanges
      ) {
        if (!confirmNavigation()) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [hasUnsavedChanges, confirmNavigation]);

  return {
    hasUnsavedChanges,
    markAsModified,
    markAsSaved,
    confirmNavigation,
  };
};
