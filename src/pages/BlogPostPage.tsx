import React from 'react';
import { useParams } from 'react-router-dom';
import { BlogPost } from '../components/blog/BlogPost';
import { Layout } from '../components/Layout';
import { blogPosts } from '../data/blogData';

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Wpis nie znaleziony</h2>
            <p className="text-gray-600 mb-4">Przepraszamy, nie możemy znaleźć tego wpisu.</p>
            <a href="/blog" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
              Wróć do bloga
            </a>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showFooter={false}>
      <BlogPost post={post} />
    </Layout>
  );
};