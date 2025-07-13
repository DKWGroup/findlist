import { httpClient } from "../utils/httpClient";
// import { refreshTokenIfNeeded } from '../middleware/AuthMiddleware'; // DISABLED FOR DEBUGGING

/**
 * Base API service with authentication handling
 */
class ApiService {
  /**
   * Make authenticated API request
   */
  protected async request<T>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    endpoint: string,
    data?: any,
    params?: Record<string, string>
  ): Promise<T> {
    try {
      // Ensure token is fresh before making request
      console.log(
        "apiService: SKIPPING refreshTokenIfNeeded() in request() for debug"
      );
      // await refreshTokenIfNeeded(); // DISABLED FOR DEBUGGING

      // Make request based on method
      switch (method) {
        case "GET":
          return await httpClient.get<T>(endpoint, params || {});
        case "POST":
          return await httpClient.post<T>(endpoint, data);
        case "PUT":
          return await httpClient.put<T>(endpoint, data);
        case "DELETE":
          return await httpClient.delete<T>(endpoint);
        default:
          throw new Error(`Unsupported method: ${method}`);
      }
    } catch (error) {
      console.error(`API request error (${method} ${endpoint}):`, error);
      throw error;
    }
  }

  /**
   * Upload file with authentication
   */
  protected async uploadFile<T>(
    endpoint: string,
    file: File,
    additionalData: Record<string, any> = {}
  ): Promise<T> {
    try {
      // Ensure token is fresh before making request
      console.log(
        "apiService: SKIPPING refreshTokenIfNeeded() in uploadFile() for debug"
      );
      // await refreshTokenIfNeeded(); // DISABLED FOR DEBUGGING

      return await httpClient.uploadFile<T>(endpoint, file, additionalData);
    } catch (error) {
      console.error(`File upload error (${endpoint}):`, error);
      throw error;
    }
  }
}

/**
 * User API service
 */
class UserApiService extends ApiService {
  /**
   * Get user profile
   */
  async getProfile(userId: string) {
    return this.request<any>("GET", `/api/users/${userId}`);
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, data: any) {
    return this.request<any>("PUT", `/api/users/${userId}`, data);
  }

  /**
   * Get user security logs
   */
  async getSecurityLogs(userId: string) {
    return this.request<any>("GET", `/api/users/${userId}/security-logs`);
  }

  /**
   * Request data export (GDPR)
   */
  async requestDataExport(userId: string) {
    return this.request<any>("POST", `/api/users/${userId}/export-data`);
  }

  /**
   * Request account deletion (GDPR)
   */
  async requestAccountDeletion(userId: string) {
    return this.request<any>("POST", `/api/users/${userId}/delete-account`);
  }
}

/**
 * Product API service
 */
class ProductApiService extends ApiService {
  /**
   * Get products with filters
   */
  async getProducts(filters: any = {}) {
    return this.request<any>("GET", "/api/products", null, filters);
  }

  /**
   * Get product by ID
   */
  async getProduct(productId: string) {
    return this.request<any>("GET", `/api/products/${productId}`);
  }

  /**
   * Add product to wishlist
   */
  async addToWishlist(productId: string) {
    return this.request<any>("POST", `/api/products/${productId}/wishlist`);
  }

  /**
   * Remove product from wishlist
   */
  async removeFromWishlist(productId: string) {
    return this.request<any>("DELETE", `/api/products/${productId}/wishlist`);
  }

  /**
   * Add review to product
   */
  async addReview(productId: string, reviewData: any) {
    return this.request<any>(
      "POST",
      `/api/products/${productId}/reviews`,
      reviewData
    );
  }
}

// Export service instances
export const userApi = new UserApiService();
export const productApi = new ProductApiService();
