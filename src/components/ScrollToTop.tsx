import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface ScrollToTopProps {
  /**
   * Określa czy przewijanie ma być płynne (smooth) czy natychmiastowe (auto)
   * @default 'auto'
   */
  behavior?: "auto" | "smooth";
}

/**
 * Komponent, który automatycznie przewija stronę na górę przy każdej zmianie route
 */
export const ScrollToTop = ({ behavior = "auto" }: ScrollToTopProps) => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Przewiń na górę strony przy każdej zmianie ścieżki
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: behavior,
    });
  }, [pathname, behavior]);

  return null;
};
