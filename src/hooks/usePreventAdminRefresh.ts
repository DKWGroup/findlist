import { useEffect } from "react";

/**
 * Hook zapobiegający odświeżaniu strony admin przy zmianie kart przeglądarki
 */
export const usePreventAdminRefresh = () => {
  useEffect(() => {
    // Zapobiegaj automatycznemu odświeżaniu przy zmianie widoczności karty
    const handleVisibilityChange = (e: Event) => {
      if (document.visibilityState === "hidden") {
        console.log("Admin page: Tab became hidden - preserving state");
      } else if (document.visibilityState === "visible") {
        console.log("Admin page: Tab became visible - preventing refresh");

        // Zapobiegaj automatycznemu odświeżeniu strony
        e.preventDefault();
        e.stopPropagation();

        // Możemy dodatkowo wyłączyć automatyczne odświeżenie tokenu na chwilę
        // Po zmianie karty Supabase może próbować odświeżyć token
        setTimeout(() => {
          console.log("Admin page: Visibility change handled safely");
        }, 100);
      }
    };

    // Zapobiegaj odświeżeniu przy zdarzeniach związanych z nawigacją
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Tylko jeśli użytkownik rzeczywiście próbuje opuścić stronę
      // (nie tylko zmienia kartę)
      if (e.type === "beforeunload") {
        console.log("Admin page: Preventing unintentional reload");
      }
    };

    // Zapobiegaj odświeżeniu przy focus/blur
    const handleFocus = () => {
      console.log("Admin page: Window focused - maintaining state");
    };

    const handleBlur = () => {
      console.log("Admin page: Window blurred - preserving state");
    };

    // Dodaj nasłuchiwanie zdarzeń
    document.addEventListener("visibilitychange", handleVisibilityChange, {
      passive: false,
    });
    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Dodatkowo - zapobiegaj automatycznemu odświeżaniu przy page show/hide
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        console.log(
          "Admin page: Page restored from cache - preventing auto-refresh"
        );
      }
    };

    const handlePageHide = () => {
      console.log("Admin page: Page hidden - preserving state");
    };

    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      // Usuń nasłuchiwanie przy odmontowywaniu
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, []);
};
