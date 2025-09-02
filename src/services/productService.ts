import { supabase } from './supabaseStorage';
import { Product } from '../types';

interface CreateProductParams {
  title: string;
  description: string;
  categoryId: string;
  productType?: string;
  priceOriginal?: number;
  priceDiscounted?: number;
  priceCurrency?: string;
  isVerified?: boolean;
  isTrending?: boolean;
  code?: string;
  urlAlias?: string;
  tags: string[];
  images: string[];
  affiliateLinks: {
    temu?: string;
    aliexpress?: string;
    amazon?: string;
    [key: string]: string | undefined;
  };
  socialLinks: {
    tiktok?: string;
    instagram?: string;
    [key: string]: string | undefined;
  };
}

class ProductService {
  /**
   * Create a new product with all related data
   */
  async createProduct(params: CreateProductParams): Promise<string> {
    try {
      const { data, error } = await supabase.rpc('create_product', {
        p_title: params.title,
        p_description: params.description,
        p_category_id: params.categoryId,
        p_product_type: params.productType || null,
        p_price_original: params.priceOriginal || null,
        p_price_discounted: params.priceDiscounted || null,
        p_price_currency: params.priceCurrency || 'PLN',
        p_is_verified: params.isVerified || false,
        p_is_trending: params.isTrending || false,
        p_code: params.code || null,
        p_url_alias: params.urlAlias || null,
        p_tags: params.tags,
        p_images: params.images,
        p_affiliate_links: params.affiliateLinks,
        p_social_links: params.socialLinks
      });

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error creating product:', error);
      throw new Error(error.message || 'Failed to create product');
    }
  }

  /**
   * Get a product by ID with all related data
   */
  async getProduct(productId: string): Promise<Product> {
    try {
      const { data, error } = await supabase.rpc('get_product_complete', {
        p_product_id: productId
      });

      if (error) throw error;
      return this.mapToProductModel(data);
    } catch (error: any) {
      console.error('Error getting product:', error);
      throw new Error(error.message || 'Failed to get product');
    }
  }

  /**
   * Get all products with pagination and filtering
   */
  async getProducts(options: {
    page?: number;
    limit?: number;
    category?: string;
    trending?: boolean;
    search?: string;
  } = {}): Promise<{ products: Product[]; total: number }> {
    try {
      const {
        page = 1,
        limit = 20,
        category,
        trending,
        search
      } = options;

      let query = supabase
        .from('products')
        .select(`
          *,
          product_tags(tag),
          product_images(url, position),
          product_affiliate_links(platform, url),
          product_social_links(platform, url),
          product_stats(*),
          product_categories(name, code, icon)
        `, { count: 'exact' });

      // Apply filters
      if (category) {
        query = query.eq('category_id', category);
      }

      if (trending) {
        query = query.eq('is_trending', true);
      }

      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,code.ilike.%${search}%`);
      }

      // Apply pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      // Execute query
      const { data, error, count } = await query;

      if (error) throw error;

      // Map data to Product model
      const products = data.map(item => this.mapToProductModel(item));

      return {
        products,
        total: count || 0
      };
    } catch (error: any) {
      console.error('Error getting products:', error);
      throw new Error(error.message || 'Failed to get products');
    }
  }

  /**
   * Update a product
   */
  async updateProduct(productId: string, params: Partial<CreateProductParams>): Promise<void> {
    try {
      // Start a transaction
      const { error: transactionError } = await supabase.rpc('begin_transaction');
      if (transactionError) throw transactionError;

      try {
        // Update product basic info
        if (params.title || params.description || params.categoryId || params.productType ||
            params.priceOriginal !== undefined || params.priceDiscounted !== undefined || 
            params.priceCurrency || params.isVerified !== undefined || 
            params.isTrending !== undefined || params.code || params.urlAlias) {
          
          const updateData: any = {};
          if (params.title) updateData.title = params.title;
          if (params.description) updateData.description = params.description;
          if (params.categoryId) updateData.category_id = params.categoryId;
          if (params.productType) updateData.product_type = params.productType;
          if (params.priceOriginal !== undefined) updateData.price_original = params.priceOriginal;
          if (params.priceDiscounted !== undefined) updateData.price_discounted = params.priceDiscounted;
          if (params.priceCurrency) updateData.price_currency = params.priceCurrency;
          if (params.isVerified !== undefined) updateData.is_verified = params.isVerified;
          if (params.isTrending !== undefined) updateData.is_trending = params.isTrending;
          if (params.code) updateData.code = params.code;
          if (params.urlAlias) updateData.url_alias = params.urlAlias;
          updateData.updated_at = new Date().toISOString();

          const { error } = await supabase
            .from('products')
            .update(updateData)
            .eq('id', productId);

          if (error) throw error;
        }

        // Update tags if provided
        if (params.tags) {
          // Delete existing tags
          const { error: deleteError } = await supabase
            .from('product_tags')
            .delete()
            .eq('product_id', productId);

          if (deleteError) throw deleteError;

          // Insert new tags
          const tagRows = params.tags.map(tag => ({
            product_id: productId,
            tag
          }));

          const { error: insertError } = await supabase
            .from('product_tags')
            .insert(tagRows);

          if (insertError) throw insertError;
        }

        // Update images if provided
        if (params.images) {
          // Delete existing images
          const { error: deleteError } = await supabase
            .from('product_images')
            .delete()
            .eq('product_id', productId);

          if (deleteError) throw deleteError;

          // Insert new images
          const imageRows = params.images.map((url, index) => ({
            product_id: productId,
            url,
            position: index
          }));

          const { error: insertError } = await supabase
            .from('product_images')
            .insert(imageRows);

          if (insertError) throw insertError;
        }

        // Update affiliate links if provided
        if (params.affiliateLinks) {
          // Delete existing links
          const { error: deleteError } = await supabase
            .from('product_affiliate_links')
            .delete()
            .eq('product_id', productId);

          if (deleteError) throw deleteError;

          // Insert new links
          const linkRows = Object.entries(params.affiliateLinks)
            .filter(([_, url]) => url && url.trim() !== '')
            .map(([platform, url]) => ({
              product_id: productId,
              platform,
              url
            }));

          if (linkRows.length > 0) {
            const { error: insertError } = await supabase
              .from('product_affiliate_links')
              .insert(linkRows);

            if (insertError) throw insertError;
          }
        }

        // Update social links if provided
        if (params.socialLinks) {
          // Delete existing links
          const { error: deleteError } = await supabase
            .from('product_social_links')
            .delete()
            .eq('product_id', productId);

          if (deleteError) throw deleteError;

          // Insert new links
          const linkRows = Object.entries(params.socialLinks)
            .filter(([_, url]) => url && url.trim() !== '')
            .map(([platform, url]) => ({
              product_id: productId,
              platform,
              url
            }));

          if (linkRows.length > 0) {
            const { error: insertError } = await supabase
              .from('product_social_links')
              .insert(linkRows);

            if (insertError) throw insertError;
          }
        }

        // Commit transaction
        const { error: commitError } = await supabase.rpc('commit_transaction');
        if (commitError) throw commitError;

      } catch (error) {
        // Rollback transaction on error
        await supabase.rpc('rollback_transaction');
        throw error;
      }
    } catch (error: any) {
      console.error('Error updating product:', error);
      throw new Error(error.message || 'Failed to update product');
    }
  }

  /**
   * Delete a product
   */
  async deleteProduct(productId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;
    } catch (error: any) {
      console.error('Error deleting product:', error);
      throw new Error(error.message || 'Failed to delete product');
    }
  }

  /**
   * Get all product categories
   */
  async getCategories(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error getting categories:', error);
      throw new Error(error.message || 'Failed to get categories');
    }
  }

  /**
   * Map database data to Product model
   */
  private mapToProductModel(data: any): Product {
    // Handle both direct query and RPC function results
    const product: Product = {
      id: data.id,
      title: data.title,
      description: data.description,
      category: data.category_id || data.category,
      productType: data.product_type,
      tags: Array.isArray(data.tags) ? data.tags : 
            (data.product_tags ? data.product_tags.map((t: any) => t.tag) : []),
      images: Array.isArray(data.images) ? data.images : 
              (data.product_images ? data.product_images.map((i: any) => i.url) : []),
      price: {
        original: data.price?.original || data.price_original,
        discounted: data.price?.discounted || data.price_discounted,
        currency: data.price?.currency || data.price_currency || 'PLN'
      },
      affiliateLinks: data.affiliate_links || {},
      socialLinks: data.social_links || {},
      popularity: data.popularity || {
        views: 0,
        likes: 0,
        shares: 0
      },
      ratings: {
        average: data.ratings?.average || 0,
        count: data.ratings?.count || 0
      },
      dateAdded: data.created_at,
      isVerified: data.is_verified,
      isTrending: data.is_trending,
      code: data.code,
      urlAlias: data.url_alias
    };

    return product;
  }
}

export const productService = new ProductService();