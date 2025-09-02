import React, { useEffect, useRef, useState } from "react";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = "",
  width,
  height,
  placeholder,
  onLoad,
  onError,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // If IntersectionObserver is not supported, show image immediately
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Simple gray placeholder
  const defaultPlaceholder =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3C/svg%3E";

  // If we don't have a valid src, show error state immediately
  if (!src || src.trim() === "") {
    return (
      <div
        className={`relative overflow-hidden bg-gray-200 ${className}`}
        ref={imgRef}
      >
        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="text-2xl mb-2">📷</div>
            <div className="text-sm">Brak obrazu</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden bg-gray-200 ${className}`}
      ref={imgRef}
    >
      {!isInView ? (
        <img
          src={placeholder || defaultPlaceholder}
          alt=""
          className="w-full h-full object-cover"
          width={width}
          height={height}
        />
      ) : (
        <>
          <img
            src={src}
            alt={alt}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
            width={width}
            height={height}
            onLoad={handleLoad}
            onError={handleError}
            loading="lazy"
            decoding="async"
          />

          {/* Loading placeholder */}
          {!isLoaded && !hasError && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* Error fallback */}
          {hasError && (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="text-2xl mb-2">📷</div>
                <div className="text-sm">Nie można załadować obrazu</div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
