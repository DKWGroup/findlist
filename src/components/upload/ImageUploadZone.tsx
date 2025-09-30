import { AlertCircle, CheckCircle, Loader2, Upload, X } from "lucide-react";
import React, { useCallback, useRef, useState } from "react";
import {
  UploadProgress,
  UploadResult,
  uploadToSupabase,
} from "../../services/supabaseStorage";
import {
  formatFileSize,
  isValidImageFile,
  ProcessedImage,
  processImage,
} from "../../utils/imageUtils";

interface ImageUploadZoneProps {
  onUploadComplete: (urls: string[]) => void;
  onUploadError: (error: string) => void;
  maxFiles?: number;
  folder?: string;
  className?: string;
  disabled?: boolean;
  existingCount?: number;
}

interface UploadState {
  id: string;
  file: ProcessedImage;
  progress: number;
  status: "processing" | "uploading" | "completed" | "error";
  error?: string;
  uploadResult?: UploadResult;
}

export const ImageUploadZone: React.FC<ImageUploadZoneProps> = ({
  onUploadComplete,
  onUploadError,
  maxFiles = 5,
  folder = "products",
  className = "",
  disabled = false,
  existingCount = 0,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploads, setUploads] = useState<UploadState[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeUploadsCount = uploads.filter(
    (upload) => upload.status === "processing" || upload.status === "uploading"
  ).length;
  const reservedSlots = existingCount + activeUploadsCount;
  const remainingSlots = Math.max(maxFiles - reservedSlots, 0);
  const isAtLimit = remainingSlots <= 0;
  const isInteractionDisabled = disabled || isAtLimit;

  const handleFiles = useCallback(
    async (files: FileList) => {
      if (disabled) return;

      const fileArray = Array.from(files);
      const validFiles = fileArray.filter(isValidImageFile);

      if (validFiles.length === 0) {
        onUploadError(
          "Nie wybrano prawidłowych plików obrazów. Obsługiwane formaty: JPG, PNG, WebP"
        );
        return;
      }

      const activeUploads = uploads.filter(
        (upload) =>
          upload.status === "processing" || upload.status === "uploading"
      ).length;
      const availableSlots = maxFiles - (existingCount + activeUploads);

      if (availableSlots <= 0) {
        onUploadError(
          `Osiągnięto limit ${maxFiles} obrazów. Usuń istniejący obraz, aby dodać nowy.`
        );
        return;
      }

      if (validFiles.length > availableSlots) {
        onUploadError(
          `Możesz przesłać jeszcze ${availableSlots} ${
            availableSlots === 1
              ? "obraz"
              : availableSlots >= 2 && availableSlots <= 4
              ? "obrazy"
              : "obrazów"
          }.`
        );
        return;
      }

      setIsProcessing(true);

      try {
        // Process images
        const processedImages = await Promise.all(
          validFiles.map(async (file) => {
            try {
              const processed = await processImage(file);
              return processed;
            } catch (error) {
              console.error("Image processing error:", error);
              throw new Error(`Błąd przetwarzania obrazu ${file.name}`);
            }
          })
        );

        // Create upload states
        const newUploads: UploadState[] = processedImages.map((processed) => ({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          file: processed,
          progress: 0,
          status: "processing" as const,
        }));

        setUploads((prev) => [...prev, ...newUploads]);
        setIsProcessing(false);

        // Start uploads
        uploadImages(newUploads);
      } catch (error) {
        setIsProcessing(false);
        onUploadError(
          error instanceof Error ? error.message : "Błąd przetwarzania obrazów"
        );
      }
    },
    [disabled, uploads, maxFiles, onUploadError, existingCount]
  );

  const uploadImages = async (uploadStates: UploadState[]) => {
    const uploadPromises = uploadStates.map(async (uploadState) => {
      try {
        // Update status to uploading
        setUploads((prev) =>
          prev.map((upload) =>
            upload.id === uploadState.id
              ? { ...upload, status: "uploading" as const }
              : upload
          )
        );

        const result = await uploadToSupabase(
          uploadState.file.file,
          "images",
          folder,
          (progress: UploadProgress) => {
            setUploads((prev) =>
              prev.map((upload) =>
                upload.id === uploadState.id
                  ? { ...upload, progress: progress.percentage }
                  : upload
              )
            );
          }
        );

        // Update status to completed
        setUploads((prev) =>
          prev.map((upload) =>
            upload.id === uploadState.id
              ? {
                  ...upload,
                  status: "completed" as const,
                  progress: 100,
                  uploadResult: result,
                }
              : upload
          )
        );

        return result.url;
      } catch (error) {
        // Update status to error
        setUploads((prev) =>
          prev.map((upload) =>
            upload.id === uploadState.id
              ? {
                  ...upload,
                  status: "error" as const,
                  error:
                    error instanceof Error ? error.message : "Błąd przesyłania",
                }
              : upload
          )
        );

        throw error;
      }
    });

    try {
      const uploadedUrls = await Promise.all(uploadPromises);
      onUploadComplete(uploadedUrls.filter(Boolean));
    } catch (error) {
      onUploadError("Niektóre obrazy nie zostały przesłane pomyślnie");
    }
  };

  const removeUpload = (index: number) => {
    setUploads((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!isInteractionDisabled) {
        setIsDragOver(true);
      }
    },
    [isInteractionDisabled]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      if (!isInteractionDisabled && e.dataTransfer.files) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [isInteractionDisabled, handleFiles]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        handleFiles(e.target.files);
      }
    },
    [handleFiles]
  );

  const openFileDialog = () => {
    if (!isInteractionDisabled) {
      fileInputRef.current?.click();
    }
  };

  const getStatusIcon = (status: UploadState["status"]) => {
    switch (status) {
      case "processing":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-600" />;
      case "uploading":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-600" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusText = (upload: UploadState) => {
    switch (upload.status) {
      case "processing":
        return "Przetwarzanie...";
      case "uploading":
        return `Przesyłanie... ${Math.round(upload.progress)}%`;
      case "completed":
        return "Przesłano pomyślnie";
      case "error":
        return upload.error || "Błąd przesyłania";
      default:
        return "";
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
          ${
            isDragOver
              ? "border-blue-500 bg-blue-50 scale-105"
              : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
          }
          ${isInteractionDisabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
        role="button"
        tabIndex={0}
        aria-label="Przeciągnij i upuść obrazy lub kliknij, aby wybrać pliki"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openFileDialog();
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isInteractionDisabled}
        />

        <div className="flex flex-col items-center space-y-4">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center ${
              isDragOver ? "bg-blue-100" : "bg-gray-100"
            }`}
          >
            {isProcessing ? (
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            ) : (
              <Upload
                className={`h-8 w-8 ${
                  isDragOver ? "text-blue-600" : "text-gray-400"
                }`}
              />
            )}
          </div>

          <div>
            <p className="text-lg font-medium text-gray-900 mb-2">
              {isProcessing
                ? "Przetwarzanie obrazów..."
                : "Przeciągnij i upuść obrazy"}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              lub{" "}
              <span className="text-blue-600 font-medium">
                kliknij, aby wybrać pliki
              </span>
            </p>
            <p className="text-xs text-gray-500">
              Obsługiwane formaty: JPG, PNG, WebP • Pozostało {remainingSlots} z{" "}
              {maxFiles} miejsc • Do 2MB każdy
            </p>
            {isAtLimit && (
              <p className="text-xs text-red-600 mt-1">
                Limit zdjęć został osiągnięty. Usuń istniejące zdjęcie, aby
                dodać nowe.
              </p>
            )}
          </div>
        </div>

        {isDragOver && (
          <div className="absolute inset-0 bg-blue-500 bg-opacity-10 rounded-xl flex items-center justify-center">
            <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium">
              Upuść pliki tutaj
            </div>
          </div>
        )}
      </div>

      {/* Upload Progress */}
      {uploads.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Przesyłane obrazy:</h4>
          {uploads.map((upload, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-start space-x-4">
                {/* Preview */}
                <div className="flex-shrink-0">
                  <img
                    src={upload.file.preview}
                    alt="Preview"
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {upload.file.file.name}
                    </p>
                    <button
                      onClick={() => removeUpload(index)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      aria-label="Usuń obraz"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex items-center space-x-2 mb-2">
                    {getStatusIcon(upload.status)}
                    <span className="text-sm text-gray-600">
                      {getStatusText(upload)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>
                      {upload.file.dimensions.width} ×{" "}
                      {upload.file.dimensions.height}
                    </span>
                    <span>
                      {formatFileSize(upload.file.originalSize)} →{" "}
                      {formatFileSize(upload.file.compressedSize)}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  {upload.status === "uploading" && (
                    <div className="mt-2">
                      <div className="bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${upload.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
