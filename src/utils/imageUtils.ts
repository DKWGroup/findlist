/**
 * Image processing utilities for upload optimization
 */

export interface ImageProcessingOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
  maxFileSize?: number; // in bytes
}

export interface ProcessedImage {
  file: File;
  preview: string;
  originalSize: number;
  compressedSize: number;
  dimensions: { width: number; height: number };
}

const DEFAULT_OPTIONS: Required<ImageProcessingOptions> = {
  maxWidth: 1920,
  maxHeight: 1080,
  quality: 0.85,
  format: 'webp',
  maxFileSize: 2 * 1024 * 1024 // 2MB
};

/**
 * Resize and optimize image while maintaining aspect ratio
 */
export const processImage = async (
  file: File,
  options: ImageProcessingOptions = {}
): Promise<ProcessedImage> => {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    img.onload = () => {
      try {
        // Calculate new dimensions while maintaining aspect ratio
        const { width: newWidth, height: newHeight } = calculateDimensions(
          img.width,
          img.height,
          opts.maxWidth,
          opts.maxHeight
        );

        // Set canvas dimensions
        canvas.width = newWidth;
        canvas.height = newHeight;

        // Enable image smoothing for better quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw and resize image
        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        // Convert to blob with specified format and quality
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to process image'));
              return;
            }

            // Check if processed image meets size requirements
            if (blob.size > opts.maxFileSize) {
              // Try with lower quality
              const lowerQuality = Math.max(0.5, opts.quality - 0.2);
              canvas.toBlob(
                (retryBlob) => {
                  if (!retryBlob) {
                    reject(new Error('Failed to compress image to required size'));
                    return;
                  }

                  const processedFile = new File(
                    [retryBlob],
                    `${file.name.split('.')[0]}.${opts.format}`,
                    { type: `image/${opts.format}` }
                  );

                  resolve({
                    file: processedFile,
                    preview: canvas.toDataURL(`image/${opts.format}`, lowerQuality),
                    originalSize: file.size,
                    compressedSize: retryBlob.size,
                    dimensions: { width: newWidth, height: newHeight }
                  });
                },
                `image/${opts.format}`,
                lowerQuality
              );
            } else {
              const processedFile = new File(
                [blob],
                `${file.name.split('.')[0]}.${opts.format}`,
                { type: `image/${opts.format}` }
              );

              resolve({
                file: processedFile,
                preview: canvas.toDataURL(`image/${opts.format}`, opts.quality),
                originalSize: file.size,
                compressedSize: blob.size,
                dimensions: { width: newWidth, height: newHeight }
              });
            }
          },
          `image/${opts.format}`,
          opts.quality
        );
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    // Create object URL for the image
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Calculate new dimensions while maintaining aspect ratio
 */
const calculateDimensions = (
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } => {
  let { width, height } = { width: originalWidth, height: originalHeight };

  // Calculate scaling factor
  const widthRatio = maxWidth / width;
  const heightRatio = maxHeight / height;
  const scalingFactor = Math.min(widthRatio, heightRatio, 1); // Don't upscale

  width = Math.round(width * scalingFactor);
  height = Math.round(height * scalingFactor);

  return { width, height };
};

/**
 * Validate image file type
 */
export const isValidImageFile = (file: File): boolean => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  return validTypes.includes(file.type);
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

/**
 * Generate unique filename with timestamp
 */
export const generateUniqueFilename = (originalName: string, prefix?: string): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop() || 'webp';
  const baseName = originalName.split('.')[0].replace(/[^a-zA-Z0-9]/g, '-');
  
  return `${prefix ? `${prefix}-` : ''}${baseName}-${timestamp}-${randomString}.${extension}`;
};