import { ArrowLeft, Calendar, ExternalLink, Star, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { blogCategories, blogLabels } from "../../data/blogData";
import { BlogPost as BlogPostType } from "../../types/blog";
import { ShareButton } from "../actions/ShareButton";

interface BlogPostProps {
  post: BlogPostType;
}

export const BlogPost: React.FC<BlogPostProps> = ({ post }) => {
  const [tableOfContents, setTableOfContents] = useState<
    { id: string; title: string; level: number }[]
  >([]);

  useEffect(() => {
    // Generate table of contents from content
    const headings = post.content.match(/^#{1,6}\s+(.+)$/gm);
    if (headings) {
      const toc = headings
        .filter((heading) => !heading.includes("Spis treści")) // Exclude manual TOC
        .map((heading) => {
          const level = heading.match(/^#+/)?.[0].length || 1;
          const title = heading.replace(/^#+\s+/, "");
          const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
          return { id, title, level };
        });
      setTableOfContents(toc);
    }
  }, [post.content]);

  const category = blogCategories.find((cat) => cat.id === post.category);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "text-yellow-500 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const normalizeListItems = (input: unknown): string[] => {
    if (!input) return [];
    if (Array.isArray(input)) {
      return input.map((item) => String(item).trim()).filter(Boolean);
    }
    if (typeof input === "string") {
      return input
        .split(/\r?\n|,/) // obsługa starszych wpisów z tekstem oddzielonym przecinkiem lub nową linią
        .map((item) => item.trim())
        .filter(Boolean);
    }
    return [];
  };

  const formatContent = (content: string) => {
    // Remove manual table of contents from content
    let processedContent = content
      .replace(/^# Spis treści[\s\S]*?^---$/gm, "")
      .trim();

    // Simple markdown to HTML conversion for display
    return processedContent
      .replace(
        /^# (.+)$/gm,
        '<h1 id="$1" class="text-3xl font-bold text-gray-900 mb-6 mt-8">$1</h1>'
      )
      .replace(
        /^## (.+)$/gm,
        '<h2 id="$1" class="text-2xl font-bold text-gray-900 mb-4 mt-6">$1</h2>'
      )
      .replace(
        /^### (.+)$/gm,
        '<h3 id="$1" class="text-xl font-semibold text-gray-900 mb-3 mt-4">$1</h3>'
      )
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
      .replace(
        /^> (.+)$/gm,
        '<blockquote class="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 italic text-gray-700">$1</blockquote>'
      )
      .replace(
        /!\[([^\]]*)\]\(([^)]+)\)/g,
        '<img src="$2" alt="$1" class="block mx-auto w-full lg:max-w-lg rounded-lg my-6 shadow-sm" />'
      )
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" class="text-blue-600 hover:text-blue-700 underline" target="_blank" rel="noopener noreferrer">$1</a>'
      )
      .replace(/^---$/gm, '<hr class="my-8 border-gray-200" />')
      .replace(/\n\n/g, '</p><p class="mb-4 leading-relaxed text-gray-700">')
      .replace(
        /^(.+)$/gm,
        '<p class="mb-4 leading-relaxed text-gray-700">$1</p>'
      );
  };

  // Process pros and cons for two-column layout
  const renderProsAndCons = () => {
    const prosItems = normalizeListItems(post.pros);
    const consItems = normalizeListItems(post.cons);

    if (prosItems.length === 0 && consItems.length === 0) return null;

    return (
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Plusy i minusy
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {prosItems.length > 0 && (
            <div>
              <h4 className="font-medium text-green-700 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Plusy
              </h4>
              <ul className="space-y-2 list-disc list-inside text-gray-700 leading-relaxed">
                {prosItems.map((item, index) => (
                  <li key={`pro-${index}`}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          {consItems.length > 0 && (
            <div>
              <h4 className="font-medium text-red-700 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                Minusy
              </h4>
              <ul className="space-y-2 list-disc list-inside text-gray-700 leading-relaxed">
                {consItems.map((item, index) => (
                  <li key={`con-${index}`}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/blog"
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Powrót do bloga</span>
          </Link>
        </div>
      </div>

      <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            {category && (
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white ${category.color}`}
              >
                {category.name}
              </span>
            )}
            {post.labels.map((labelId) => {
              const label = blogLabels.find((l) => l.id === labelId);
              if (!label) return null;
              return (
                <span
                  key={labelId}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${label.color}`}
                >
                  {label.name}
                </span>
              );
            })}
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-6 text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(post.publishedAt).toLocaleDateString("pl-PL")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{post.author.name}</span>
              </div>
              {post.overallRating && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Ocena:</span>
                  <div className="flex items-center gap-1">
                    {renderStars(post.overallRating)}
                    <span className="text-sm font-medium ml-1">
                      {post.overallRating}/5
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <ShareButton
                variant="icon"
                title={post.title}
                description={post.excerpt || post.title}
              />
            </div>
          </div>

          {post.featuredImage && (
            <div className="mt-6 overflow-hidden rounded-2xl border border-gray-100 shadow-md">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-auto max-h-[520px] object-cover"
              />
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents Sidebar */}
          {tableOfContents.length > 0 && (
            <aside className="lg:col-span-1">
              <div className="sticky top-24 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Spis treści
                </h3>
                <nav className="space-y-2">
                  {tableOfContents.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`block text-sm text-gray-600 hover:text-blue-600 transition-colors ${
                        item.level > 2 ? "ml-4" : ""
                      }`}
                    >
                      {item.title}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
          )}

          {/* Article Content */}
          <div
            className={`${
              tableOfContents.length > 0 ? "lg:col-span-3" : "lg:col-span-4"
            }`}
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{
                  __html: formatContent(post.content),
                }}
              />

              {/* Pros and Cons in Two Columns */}
              {renderProsAndCons()}

              {/* Not For Who Section */}
              {post.notForWho && (
                <div className="mt-8 p-6 bg-orange-50 rounded-lg border border-orange-200">
                  <h3 className="text-lg font-semibold text-orange-900 mb-3">
                    Dla kogo NIE jest ten produkt
                  </h3>
                  <p className="text-orange-800 leading-relaxed">
                    {post.notForWho}
                  </p>
                </div>
              )}

              {/* Section Ratings for Reviews */}
              {post.type === "review" && post.sectionRatings && (
                <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Oceny szczegółowe
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <span>Przeznaczenie:</span>
                      <div className="flex items-center gap-1">
                        {renderStars(post.sectionRatings.purpose)}
                        <span className="ml-2 font-medium">
                          {post.sectionRatings.purpose}/5
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Jakość:</span>
                      <div className="flex items-center gap-1">
                        {renderStars(post.sectionRatings.quality)}
                        <span className="ml-2 font-medium">
                          {post.sectionRatings.quality}/5
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Funkcjonalność:</span>
                      <div className="flex items-center gap-1">
                        {renderStars(post.sectionRatings.functionality)}
                        <span className="ml-2 font-medium">
                          {post.sectionRatings.functionality}/5
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Cena:</span>
                      <div className="flex items-center gap-1">
                        {renderStars(post.sectionRatings.price)}
                        <span className="ml-2 font-medium">
                          {post.sectionRatings.price}/5
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Product Links */}
              {post.productLinks &&
                Object.keys(post.productLinks).length > 0 && (
                  <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Gdzie kupić
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {Object.entries(post.productLinks).map(
                        ([platform, url]) => (
                          <a
                            key={platform}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                          >
                            <ExternalLink className="h-4 w-4" />
                            <span className="capitalize">
                              {platform === "aliexpress"
                                ? "AliExpress"
                                : platform}
                            </span>
                          </a>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* TikTok Video */}
              {post.tiktokVideo && (
                <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Zobacz na TikTok
                  </h3>
                  <a
                    href={post.tiktokVideo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Obejrzyj viral video</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};
