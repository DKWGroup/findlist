import { useCallback, useEffect, useRef } from "react";

interface FormStateOptions {
  key: string;
  debounceMs?: number;
  clearOnSubmit?: boolean;
}

/**
 * Hook do automatycznego zapisywania i przywracania stanu formularzy
 */
export const useFormPersistence = <T extends Record<string, any>>(
  formData: T,
  setFormData: (data: T) => void,
  options: FormStateOptions
) => {
  const { key, debounceMs = 1000, clearOnSubmit = true } = options;
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  const initialLoadRef = useRef(false);

  // Ładowanie zapisanych danych
  const loadSavedData = useCallback((): T | null => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsedData = JSON.parse(saved);
        console.log(`Loaded form data for key: ${key}`);
        return parsedData;
      }
    } catch (error) {
      console.error(`Error loading saved form data for key ${key}:`, error);
    }
    return null;
  }, [key]);

  // Zapisywanie danych
  const saveData = useCallback(
    (data: T) => {
      try {
        // Sprawdź czy dane są warte zapisania (nie są puste)
        const hasContent = Object.values(data).some((value) => {
          if (typeof value === "string") return value.trim().length > 0;
          if (Array.isArray(value)) return value.length > 0;
          if (typeof value === "object" && value !== null) {
            return Object.values(value).some((v) =>
              typeof v === "string" ? v.trim().length > 0 : !!v
            );
          }
          return !!value;
        });

        if (hasContent) {
          localStorage.setItem(key, JSON.stringify(data));
          console.log(`Saved form data for key: ${key}`);
        }
      } catch (error) {
        console.error(`Error saving form data for key ${key}:`, error);
      }
    },
    [key]
  );

  // Czyszczenie zapisanych danych
  const clearSavedData = useCallback(() => {
    try {
      localStorage.removeItem(key);
      console.log(`Cleared form data for key: ${key}`);
    } catch (error) {
      console.error(`Error clearing saved form data for key ${key}:`, error);
    }
  }, [key]);

  // Inicjalne załadowanie danych
  useEffect(() => {
    if (!initialLoadRef.current) {
      const savedData = loadSavedData();
      if (savedData) {
        setFormData({ ...formData, ...savedData });
      }
      initialLoadRef.current = true;
    }
  }, [loadSavedData, setFormData, formData]);

  // Auto-save przy zmianach
  useEffect(() => {
    if (initialLoadRef.current) {
      // Debounce saving
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(() => {
        saveData(formData);
      }, debounceMs);
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [formData, saveData, debounceMs]);

  // Event listeners dla visibility change i beforeunload
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        // Natychmiast zapisz przy ukryciu karty
        saveData(formData);
      }
    };

    const handleBeforeUnload = () => {
      // Zapisz przed zamknięciem strony
      saveData(formData);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [formData, saveData]);

  // Funkcja do manualnego zapisania (np. przy submicie)
  const handleFormSubmit = useCallback(() => {
    if (clearOnSubmit) {
      clearSavedData();
    }
  }, [clearOnSubmit, clearSavedData]);

  // Funkcja sprawdzająca czy są zapisane dane
  const hasSavedData = useCallback((): boolean => {
    const saved = localStorage.getItem(key);
    return saved !== null && saved.trim() !== "";
  }, [key]);

  return {
    hasSavedData,
    clearSavedData,
    handleFormSubmit,
  };
};
