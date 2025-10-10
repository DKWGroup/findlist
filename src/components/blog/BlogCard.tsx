import {
  AlertTriangle,
  Calendar,
  Eye,
  Package,
  Star,
  User,
} from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { blogLabels } from "../../data/blogData";
import { BlogPost } from "../../types/blog";

interface BlogCardProps {
  post: BlogPost;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  const getTypeIcon = () => {
    switch (post.type) {
      case "review":
        return <Star className="h-4 w-4" />;
      case "collection":
        return <Package className="h-4 w-4" />;
      case "scam-alert":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Eye className="h-4 w-4" />;
    }
  };

  const getTypeLabel = () => {
    switch (post.type) {
      case "review":
        return "Recenzja";
      case "collection":
        return "Zbiór produktów";
      case "scam-alert":
        return "Scam Alert";
      default:
        return "Artykuł";
    }
  };

  const getTypeColor = () => {
    switch (post.type) {
      case "review":
        return "bg-blue-100 text-blue-800";
      case "collection":
        return "bg-green-100 text-green-800";
      case "scam-alert":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <article className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <Link to={`/blog/${post.slug}`} className="block">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <span
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor()}`}
            >
              {getTypeIcon()}
              {getTypeLabel()}
            </span>
            {post.isFeatured && (
              <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                Wyróżnione
              </span>
            )}
          </div>
          {post.overallRating && (
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
              <Star className="h-3 w-3 text-yellow-500 fill-current" />
              <span className="text-xs font-medium">
                {post.overallRating}/5
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-6">
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>
              {new Date(post.publishedAt).toLocaleDateString("pl-PL")}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>{post.author.name}</span>
          </div>
        </div>

        <Link to={`/blog/${post.slug}`}>
          <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {post.title}
          </h2>
        </Link>

        <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>

        {/* Labels */}
        {post.labels.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.labels.map((labelId) => {
              const label = blogLabels.find((l) => l.id === labelId);
              if (!label) return null;
              return (
                <span
                  key={labelId}
                  className={`px-2 py-1 rounded-full text-xs font-medium ${label.color}`}
                >
                  {label.name}
                </span>
              );
            })}
          </div>
        )}

        <Link
          to={`/blog/${post.slug}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm group-hover:gap-2 transition-all"
        >
          <span>Czytaj więcej</span>
          <span className="ml-1 group-hover:translate-x-1 transition-transform">
            →
          </span>
        </Link>
      </div>
    </article>
  );
};
