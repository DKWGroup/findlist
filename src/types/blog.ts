export interface BlogPost {
  id: string;
  type: 'review' | 'collection' | 'scam-alert';
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  publishedAt: string;
  updatedAt: string;
  isPublished: boolean;
  isFeatured: boolean;
  category: string;
  tags: string[];
  labels: string[];
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  // Review specific fields
  productId?: string;
  overallRating?: number;
  sectionRatings?: {
    purpose: number;
    quality: number;
    functionality: number;
    price: number;
    conclusions: number;
  };
  pros?: string;
  cons?: string;
  notForWho?: string;
  productLinks?: {
    temu?: string;
    aliexpress?: string;
    amazon?: string;
  };
  tiktokVideo?: string;
  // Collection specific fields
  products?: {
    id: string;
    title: string;
    image: string;
    description: string;
    reviewLink?: string;
    shopLink: string;
    tiktokLink?: string;
  }[];
  // Scam alert specific fields
  scamReason?: string;
  originalProductLink?: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
  postCount: number;
}

export interface BlogLabel {
  id: string;
  name: string;
  color: string;
  type: 'positive' | 'negative' | 'neutral' | 'warning';
}