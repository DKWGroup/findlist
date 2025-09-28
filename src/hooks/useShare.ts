import { useCallback, useState } from "react";

interface ShareData {
  title?: string;
  text?: string;
  url?: string;
}

export const useShare = () => {
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sharePost = useCallback(async (data: ShareData) => {
    const sharePayload = {
      title: data.title || document.title,
      text: data.text || "Sprawdź to!",
      url: data.url || window.location.href,
    };

    // Reset state
    setIsCopied(false);
    setError(null);

    try {
      if (navigator.share) {
        // Użyj Web Share API
        await navigator.share(sharePayload);
      } else {
        // Opcja zapasowa: kopiuj do schowka
        await navigator.clipboard.writeText(sharePayload.url);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2500); // Zresetuj stan po 2.5s
      }
    } catch (err) {
      console.error("Błąd podczas udostępniania:", err);
      setError("Nie udało się udostępnić. Spróbuj ponownie.");
      // Dodatkowa próba skopiowania do schowka w razie błędu
      try {
        await navigator.clipboard.writeText(sharePayload.url);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2500);
      } catch (copyErr) {
        console.error("Błąd kopiowania do schowka:", copyErr);
        setError("Nie udało się skopiować linku.");
      }
    }
  }, []);

  return { sharePost, isCopied, error };
};
