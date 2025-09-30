import { useEffect } from "react";

const REFRESH_CONFIRM_MESSAGE =
  "Czy na pewno chcesz odświeżyć stronę? Niezapisane zmiany zostaną utracone.";

const shouldBlockRefresh = (event: KeyboardEvent): boolean => {
  if (event.key === "F5") {
    return true;
  }

  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "r") {
    return true;
  }

  return false;
};

const getClosestForm = (
  target: EventTarget | Element | null
): HTMLFormElement | null => {
  if (target instanceof Element) {
    return target.closest("form");
  }

  return null;
};

const resolveFormFromEvent = (event: KeyboardEvent): HTMLFormElement | null => {
  const fromTarget = getClosestForm(event.target);

  if (fromTarget) {
    return fromTarget;
  }

  if (typeof document === "undefined") {
    return null;
  }

  return getClosestForm(document.activeElement);
};

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.defaultPrevented || !shouldBlockRefresh(event)) {
    return;
  }

  const form = resolveFormFromEvent(event);

  if (!form) {
    return;
  }

  const shouldRefresh = window.confirm(REFRESH_CONFIRM_MESSAGE);

  if (!shouldRefresh) {
    event.preventDefault();
    event.stopPropagation();
  }
};

let activeSubscribers = 0;

/**
 * Hook zapobiegający przypadkowemu odświeżeniu strony
 * poprzez przechwytywanie skrótów klawiszowych powodujących reload.
 */
export const usePreventPageRefresh = () => {
  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    activeSubscribers += 1;

    if (activeSubscribers === 1) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      activeSubscribers = Math.max(0, activeSubscribers - 1);

      if (activeSubscribers === 0) {
        document.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, []);
};
