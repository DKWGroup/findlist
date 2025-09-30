import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BlogPost as BlogPostComponent } from "../components/blog/BlogPost";
import { Layout } from "../components/Layout";
import { getPostBySlug } from "../services/blogService";
import { BlogPost } from "../types/blog";

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchPost = async () => {
      if (!slug) {
        if (isMounted) {
          setPost(null);
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const fetchedPost = await getPostBySlug(slug);
        if (isMounted) {
          setPost(fetchedPost);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setError("Nie udało się załadować wpisu. Spróbuj ponownie później.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchPost();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-semibold text-gray-700">
              Ładowanie wpisu...
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Wystąpił błąd
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <a
              href="/blog"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Wróć do bloga
            </a>
          </div>
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Wpis nie znaleziony
            </h2>
            <p className="text-gray-600 mb-4">
              Przepraszamy, nie możemy znaleźć tego wpisu.
            </p>
            <a
              href="/blog"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Wróć do bloga
            </a>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showFooter={false}>
      <BlogPostComponent post={post} />
    </Layout>
  );
};
