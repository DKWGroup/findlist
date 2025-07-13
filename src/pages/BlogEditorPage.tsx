import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BlogEditor } from "../components/blog/BlogEditor";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { blogPosts } from "../data/blogData";
import { BlogPost } from "../types/blog";
// import { refreshTokenIfNeeded } from '../middleware/AuthMiddleware'; // DISABLED FOR DEBUGGING

export const BlogEditorPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Refresh token when editor page loads
  useEffect(() => {
    console.log("BlogEditorPage: SKIPPING refreshTokenIfNeeded() for debug");
    // refreshTokenIfNeeded(); // DISABLED FOR DEBUGGING
  }, []);

  const post =
    slug && slug !== "nowy"
      ? blogPosts.find((p) => p.slug === slug)
      : undefined;

  const handleSave = async (postData: Partial<BlogPost>) => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Saving post:", postData);

      // In a real app, this would save to the backend
      // For now, we'll just navigate back to the blog
      navigate("/blog");
    } catch (error) {
      console.error("Error saving post:", error);
      alert("Wystąpił błąd podczas zapisywania wpisu");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/blog");
  };

  return (
    <ProtectedRoute requireAdmin>
      <BlogEditor
        post={post}
        onSave={handleSave}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </ProtectedRoute>
  );
};
