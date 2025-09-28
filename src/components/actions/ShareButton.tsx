import { Share2 } from "lucide-react";
import React, { useState } from "react";

interface ShareButtonProps {
  title: string;
  description?: string;
  urlAlias?: string | null;
  variant?: "icon" | "full";
  className?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  title,
  description,
  urlAlias,
  variant = "full",
  className = "",
}) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareUrl = urlAlias
      ? `${window.location.origin}/${urlAlias}`
      : window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description || title,
          url: shareUrl,
        });
      } catch {
        /* użytkownik anulował */
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        /* ignoruj */
      }
    }
  };

  if (variant === "icon") {
    return (
      <button
        onClick={handleShare}
        aria-label="Udostępnij"
        className={`p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors ${className}`}
      >
        <Share2 className="h-5 w-5" />
      </button>
    );
  }

  return (
    <button
      onClick={handleShare}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 hover:border-blue-300 transition-colors ${className}`}
    >
      <Share2 className="h-5 w-5 text-gray-400" />
      <span className="text-sm font-medium">
        {copied ? "Skopiowano!" : "Udostępnij"}
      </span>
    </button>
  );
};
