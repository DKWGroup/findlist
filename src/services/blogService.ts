import { BlogPost } from "../types/blog";
import { supabase } from "./supabaseStorage";

// --- Helper do konwersji ---
// Konwertuje klucze obiektu z camelCase na snake_case
const toSnakeCase = (obj: Record<string, any>): Record<string, any> => {
  const newObj: Record<string, any> = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const snakeKey = key.replace(
        /[A-Z]/g,
        (letter) => `_${letter.toLowerCase()}`
      );
      newObj[snakeKey] = obj[key];
    }
  }
  return newObj;
};

const mapDbPostToBlogPost = (post: any): BlogPost => ({
  id: post.id,
  title: post.title,
  slug: post.slug,
  excerpt: post.excerpt,
  content: post.content,
  featuredImage: post.featured_image,
  category: post.category,
  tags: post.tags || [],
  labels: post.labels || [],
  pros: post.pros || [],
  cons: post.cons || [],
  isPublished: post.is_published,
  isFeatured: post.is_featured,
  publishedAt: post.published_at,
  updatedAt: post.updated_at,
  author: {
    id: post.author_id,
    name: post.author?.full_name || "Nieznany autor",
  },
  type: post.type || "post",
  seo: post.seo || {},
  productId: post.product_id,
  overallRating: post.overall_rating,
  sectionRatings: post.section_ratings,
  notForWho: post.not_for_who,
  ratings: post.ratings,
  productLinks: post.product_links,
  tiktokVideo: post.tiktok_video,
  products: post.products,
});

// --- Funkcje serwisu ---

/**
 * Pobiera wszystkie wpisy blogowe z bazy danych.
 */
export const getPosts = async (): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    .from("blog_posts")
    .select(
      `
      *,
      author:profiles(full_name)
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Błąd podczas pobierania postów:", error);
    throw new Error("Nie udało się załadować wpisów.");
  }

  // Mapowanie danych z bazy (snake_case) na format aplikacji (camelCase)
  return data.map(mapDbPostToBlogPost);
};

export const getPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  const { data, error } = await supabase
    .from("blog_posts")
    .select(
      `
      *,
      author:profiles(full_name)
    `
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Błąd podczas pobierania posta:", error);
    throw new Error("Nie udało się załadować wpisu.");
  }

  if (!data) {
    return null;
  }

  return mapDbPostToBlogPost(data);
};

/**
 * Tworzy nowy wpis blogowy.
 */
export const createPost = async (postData: Partial<BlogPost>): Promise<any> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Użytkownik nie jest zalogowany.");

  const dataForDb = toSnakeCase(postData);
  const finalData = {
    ...dataForDb,
    author_id: user.id,
    slug:
      dataForDb.title
        ?.toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "") || `post-${Date.now()}`,
  };

  const { data, error } = await supabase
    .from("blog_posts")
    .insert(finalData)
    .select()
    .single();

  if (error) {
    console.error("Błąd podczas tworzenia posta:", error);
    throw new Error("Nie udało się utworzyć wpisu.");
  }
  return data;
};

/**
 * Aktualizuje istniejący wpis blogowy.
 */
export const updatePost = async (
  postId: string,
  postData: Partial<BlogPost>
): Promise<any> => {
  // --- DODAJ TĘ LINIĘ ---
  // Usuwamy pole 'author', ponieważ nie ma takiej kolumny w bazie danych.
  // Aktualizujemy tylko dane posta, a nie jego autora.
  delete postData.author;
  // -----------------------

  const dataForDb = toSnakeCase(postData);

  const { data, error } = await supabase
    .from("blog_posts")
    .update(dataForDb)
    .eq("id", postId)
    .select()
    .single();

  if (error) {
    console.error("Błąd podczas aktualizacji posta:", error);
    throw new Error("Nie udało się zaktualizować wpisu.");
  }
  return data;
};

/**
 * Usuwa wpis blogowy.
 */
export const deletePost = async (postId: string): Promise<void> => {
  const { error } = await supabase.from("blog_posts").delete().eq("id", postId);

  if (error) {
    console.error("Błąd podczas usuwania posta:", error);
    throw new Error("Nie udało się usunąć wpisu.");
  }
};
