import { createClient } from "@supabase/supabase-js";

// Note: In a real application, these should be environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Sprawdź czy zmienne są dostępne
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase environment variables are missing!");
}

// Konfiguracja klienta Supabase z rozszerzonymi opcjami persystencji
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: false, // TYMCZASOWO WYŁĄCZONY - może powodować refresh przy zmianie kart
    detectSessionInUrl: true,
    storageKey: "findlist-auth-storage",
    flowType: "pkce",
  },
});

// Dodaj funkcję do debugowania stanu sesji
export const debugSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  console.log(
    "Current session state:",
    data.session
      ? `Active (expires: ${new Date(
          (data.session.expires_at || 0) * 1000
        ).toLocaleString()})`
      : "None",
    error ? `Error: ${error.message}` : ""
  );

  if (data.session) {
    // Check token expiration
    const expiresAt = (data.session.expires_at || 0) * 1000;
    const now = Date.now();
    const timeLeft = expiresAt - now;

    console.log(`Token expires in: ${Math.round(timeLeft / 60000)} minutes`);

    // Check if user data is available
    const { data: userData, error: userError } = await supabase.auth.getUser();
    console.log(
      "User data available:",
      !!userData.user,
      userError ? `Error: ${userError.message}` : ""
    );
  }

  return { data, error };
};

// Funkcja do sprawdzania i odświeżania tokenu
export const checkAndRefreshToken = async (): Promise<boolean> => {
  try {
    const { data } = await supabase.auth.getSession();

    if (!data.session) {
      console.log("No active session to refresh");
      return false;
    }

    // Check if token is about to expire (within 5 minutes)
    const expiresAt = (data.session.expires_at || 0) * 1000;
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;

    if (expiresAt - now < fiveMinutes) {
      console.log("Token is about to expire, refreshing...");
      const { data: refreshData, error } = await supabase.auth.refreshSession();

      if (error || !refreshData.session) {
        // Check if this is an expected "no session" scenario
        if (
          error &&
          (error.message.includes("Auth session missing") ||
            error.message.includes("Refresh Token Not Found") ||
            error.message.includes("Invalid Refresh Token"))
        ) {
          console.log(
            "Token refresh skipped - no valid session available:",
            error.message
          );
        } else {
          console.error("Token refresh failed:", error);
        }
        return false;
      }

      console.log("Token refreshed successfully");
      return true;
    }

    return true;
  } catch (error) {
    // Handle expected scenarios where no session exists
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (
      errorMessage.includes("Auth session missing") ||
      errorMessage.includes("Refresh Token Not Found") ||
      errorMessage.includes("Invalid Refresh Token")
    ) {
      console.log(
        "Token refresh check skipped - no valid session available:",
        errorMessage
      );
    } else {
      console.error("Token refresh check error:", error);
    }
    return false;
  }
};

export interface UploadResult {
  url: string;
  path: string;
  fullUrl: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

/**
 * Upload file to Supabase Storage with progress tracking
 */
export const uploadToSupabase = async (
  file: File,
  bucket: string = "images",
  folder: string = "products",
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> => {
  try {
    // Generate unique file path
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const fileName = `${
      file.name.split(".")[0]
    }-${timestamp}-${randomString}.webp`;
    const filePath = `${folder}/${fileName}`;

    // Simulate progress for better UX (Supabase doesn't provide native progress)
    if (onProgress) {
      const progressInterval = setInterval(() => {
        const fakeProgress = Math.min(90, Math.random() * 80 + 10);
        onProgress({
          loaded: (file.size * fakeProgress) / 100,
          total: file.size,
          percentage: fakeProgress,
        });
      }, 100);

      // Clear interval after a short delay
      setTimeout(() => clearInterval(progressInterval), 1000);
    }

    // Upload file to Supabase Storage
    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    if (onProgress) {
      onProgress({
        loaded: file.size,
        total: file.size,
        percentage: 100,
      });
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return {
      url: urlData.publicUrl,
      path: filePath,
      fullUrl: urlData.publicUrl,
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Delete file from Supabase Storage
 */
export const deleteFromSupabase = async (
  filePath: string,
  bucket: string = "images"
): Promise<void> => {
  const { error } = await supabase.storage.from(bucket).remove([filePath]);

  if (error) {
    throw new Error(`Delete failed: ${error.message}`);
  }
};

/**
 * Initialize Supabase Storage bucket (for setup)
 */
export const initializeStorageBucket = async (
  bucketName: string = "images"
) => {
  try {
    // Check if bucket exists by attempting to list files
    const { error } = await supabase.storage
      .from(bucketName)
      .list("", { limit: 1 });

    if (error) {
      throw new Error(
        `Bucket '${bucketName}' does not exist or is not accessible. Please create it manually in Supabase Dashboard.`
      );
    }

    console.log(`Bucket ${bucketName} is accessible and ready to use.`);
  } catch (error) {
    throw error;
  }
};
