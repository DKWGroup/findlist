import React from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: "lazy" | "eager";
  sizes?: string;
  quality?: number;
  placeholder?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = "",
  loading = "lazy",
  sizes,
  quality = 85,
  placeholder,
  ...props
}) => {
  // Generate srcset for responsive images
  const generateSrcSet = (baseSrc: string) => {
    if (!baseSrc) return "";

    const widths = [320, 640, 768, 1024, 1280, 1536];
    return widths.map((w) => `${baseSrc}?w=${w}&q=${quality} ${w}w`).join(", ");
  };

  // Default sizes if not provided
  const defaultSizes =
    "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";

  const imgProps = {
    src: quality < 100 ? `${src}?q=${quality}` : src,
    alt,
    className,
    loading,
    width,
    height,
    sizes: sizes || defaultSizes,
    srcSet: generateSrcSet(src),
    onError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      // Fallback to placeholder if image fails to load
      if (placeholder) {
        (e.target as HTMLImageElement).src = placeholder;
      }
    },
    ...props,
  };

  return (
    <img
      {...imgProps}
      style={{
        maxWidth: "100%",
        height: "auto",
      }}
    />
  );
};

export default OptimizedImage;
