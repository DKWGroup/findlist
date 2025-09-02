// SEO utility functions

export const generateMetaTitle = (title: string, maxLength: number = 60): string => {
  if (title.length <= maxLength) return title;
  return title.substring(0, maxLength - 3) + '...';
};

export const generateMetaDescription = (description: string, maxLength: number = 155): string => {
  if (description.length <= maxLength) return description;
  return description.substring(0, maxLength - 3) + '...';
};

export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export const generateCanonicalUrl = (path: string): string => {
  const baseUrl = 'https://viralist.pl';
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
};

export const generateBreadcrumbs = (pathname: string) => {
  const paths = pathname.split('/').filter(Boolean);
  const breadcrumbs = [];
  
  let currentPath = '';
  
  for (const path of paths) {
    currentPath += `/${path}`;
    
    // Map paths to readable names
    let label = path;
    switch (path) {
      case 'produkty':
        label = 'Produkty';
        break;
      case 'blog':
        label = 'Blog';
        break;
      case 'search':
        label = 'Wyszukiwanie';
        break;
      case 'elektronika':
        label = 'Elektronika';
        break;
      case 'dom-ogrod':
        label = 'Dom i ogród';
        break;
      case 'moda':
        label = 'Moda';
        break;
      case 'uroda':
        label = 'Uroda';
        break;
      default:
        // For product codes or slugs, keep as is but capitalize
        label = path.charAt(0).toUpperCase() + path.slice(1);
    }
    
    breadcrumbs.push({
      label,
      href: currentPath,
      current: currentPath === pathname
    });
  }
  
  return breadcrumbs;
};

export const generateStructuredDataForProduct = (product: any) => {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "description": product.description,
    "image": product.images,
    "sku": product.code || product.id,
    "brand": {
      "@type": "Brand",
      "name": "VIRALIST"
    },
    "offers": {
      "@type": "Offer",
      "price": product.price.discounted || product.price.original,
      "priceCurrency": product.price.currency,
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.ratings.average,
      "reviewCount": product.ratings.count
    }
  };
};

export const optimizeImageUrl = (url: string, width?: number, height?: number, format?: 'webp' | 'jpg'): string => {
  // For Pexels images, add optimization parameters
  if (url.includes('pexels.com')) {
    const params = new URLSearchParams();
    if (width) params.set('w', width.toString());
    if (height) params.set('h', height.toString());
    if (format) params.set('fm', format);
    params.set('auto', 'compress');
    params.set('cs', 'tinysrgb');
    
    return `${url}?${params.toString()}`;
  }
  
  return url;
};

export const preloadCriticalResources = () => {
  if (typeof window === 'undefined') return;
  
  // Preload critical fonts
  const fontLink = document.createElement('link');
  fontLink.rel = 'preload';
  fontLink.href = '/fonts/inter-var.woff2';
  fontLink.as = 'font';
  fontLink.type = 'font/woff2';
  fontLink.crossOrigin = 'anonymous';
  document.head.appendChild(fontLink);
  
  // Preload hero image
  const heroImageLink = document.createElement('link');
  heroImageLink.rel = 'preload';
  heroImageLink.href = '/images/hero-bg.webp';
  heroImageLink.as = 'image';
  document.head.appendChild(heroImageLink);
};

export const measureCoreWebVitals = () => {
  if (typeof window === 'undefined') return;
  
  // Measure and report Core Web Vitals
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS(console.log);
    getFID(console.log);
    getFCP(console.log);
    getLCP(console.log);
    getTTFB(console.log);
  });
};