export interface Product {
  id: string;
  code?: string; // Dodany kod produktu
  title: string;
  description: string;
  images: string[];
  category: string;
  productType?: string; // Dodany typ produktu
  tags: string[];
  price: {
    original?: number;
    discounted?: number;
    currency: string;
  };
  affiliateLinks: {
    temu?: string;
    aliexpress?: string;
    amazon?: string;
  };
  socialLinks: {
    tiktok?: string;
    instagram?: string;
  };
  popularity: {
    views: number;
    likes: number;
    shares: number;
  };
  ratings: {
    average: number;
    count: number;
  };
  dateAdded: string;
  isVerified: boolean;
  isTrending: boolean;
  urlAlias?: string; // Dodany alias URL
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  productCount: number;
  code?: string; // Dodany kod kategorii
}

export interface User {
  id: string;
  email: string;
  name: string;
  wishlist: string[];
  reviews: Review[];
}

export interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string;
  dateCreated: string;
}