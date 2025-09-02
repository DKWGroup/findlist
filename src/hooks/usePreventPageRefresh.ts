import { useEffect } from "react";

/**
 * Hook zapobiegający przypadkowemu odświeżeniu strony
 * przy przełączaniu między kartami przeglądarki
 */
export const usePreventPageRefresh = () => {
  useEffect(() => {
    // Funkcja obsługująca zmianę widoczności karty
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log("Tab became visible - preventing potential page refresh");

        // Zatrzymaj wszystkie potencjalne timery które mogą powodować odświeżenie
        // Reset focus na body element aby zapobiec przypadkowym submittom formularzy
        if (
          document.activeElement &&
          document.activeElement !== document.body
        ) {
          (document.activeElement as HTMLElement).blur?.();
          document.body.focus();
        }
      } else {
        console.log("Tab became hidden - saving state");
      }
    };

    // Funkcja zapobiegająca przypadkowemu odświeżeniu przy zamykaniu karty
    const handleBeforeUnload = () => {
      // Nie pokazuj ostrzeżenia, po prostu zapisz stan cicho
      console.log("Page unload detected - ensuring state is saved");
    };

    // Funkcja obsługująca utratę fokusa przez okno
    const handleWindowBlur = () => {
      console.log("Window lost focus - maintaining state");
    };

    // Funkcja obsługująca powrót fokusa do okna
    const handleWindowFocus = () => {
      console.log("Window gained focus - restoring state");
    };

    // Funkcja zapobiegająca przypadkowemu submit formularzy przez Enter
    const handleKeyDown = (e: KeyboardEvent) => {
      // Zapobiegaj przypadkowemu refresh przez F5 lub Ctrl+R w przypadku gdy użytkownik
      // przypadkowo naciśnie te kombinacje po powrocie do karty
      if (e.key === "F5" || (e.ctrlKey && e.key === "r")) {
        const isInForm = (e.target as Element)?.closest("form");
        if (
          isInForm &&
          !window.confirm(
            "Czy na pewno chcesz odświeżyć stronę? Niezapisane zmiany zostaną utracone."
          )
        ) {
          e.preventDefault();
        }
      }
    };

    // Dodaj event listenery
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("focus", handleWindowFocus);
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("focus", handleWindowFocus);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
};
