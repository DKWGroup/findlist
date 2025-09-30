import { ExternalLink } from "lucide-react";
import React from "react";

interface BlogReviewLinkProps {
  url: string;
  className?: string;
  label?: string;
}

export const BlogReviewLink: React.FC<BlogReviewLinkProps> = ({
  url,
  className = "",
  label = "Przeczytaj recenzję tego produktu na blogu",
}) => {
  if (!url) return null;
  return (
    <div className={`mb-3 ${className}`}>
      <a
        href={url}
        className="inline-flex items-center gap-2 text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-2 rounded-lg transition-colors"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="font-semibold">{label}</span>
        <ExternalLink className="h-4 w-4" />
      </a>
    </div>
  );
};
