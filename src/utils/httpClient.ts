import { supabase } from '../services/supabaseStorage';
import { refreshTokenIfNeeded } from '../middleware/AuthMiddleware';

/**
 * HTTP client with authentication and error handling
 */
class HttpClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json'
    };
  }

  /**
   * Add authentication headers to requests
   */
  private async getAuthHeaders(): Promise<Record<string, string>> {
    try {
      // Check if token needs refresh
      await refreshTokenIfNeeded();
      
      // Get current session
      const { data } = await supabase.auth.getSession();
      
      if (!data.session) {
        return this.defaultHeaders;
      }
      
      return {
        ...this.defaultHeaders,
        'Authorization': `Bearer ${data.session.access_token}`
      };
    } catch (error) {
      console.error('Error getting auth headers:', error);
      return this.defaultHeaders;
    }
  }

  /**
   * Handle API response
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      // Handle authentication errors
      if (response.status === 401 || response.status === 403) {
        // Try to refresh token
        const refreshed = await refreshTokenIfNeeded();
        
        if (!refreshed) {
          // If refresh failed, redirect to login
          window.location.href = '/logowanie';
        }
        
        throw new Error('Błąd autoryzacji. Zaloguj się ponownie.');
      }
      
      // Handle other errors
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Błąd ${response.status}: ${response.statusText}`);
    }
    
    // Parse JSON response
    try {
      return await response.json();
    } catch (error) {
      // Return empty object for empty responses
      return {} as T;
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    // Build URL with query parameters
    const url = new URL(this.baseUrl + endpoint);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
    
    // Get auth headers
    const headers = await this.getAuthHeaders();
    
    // Make request
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers
    });
    
    return this.handleResponse<T>(response);
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data: any): Promise<T> {
    // Get auth headers
    const headers = await this.getAuthHeaders();
    
    // Make request
    const response = await fetch(this.baseUrl + endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });
    
    return this.handleResponse<T>(response);
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data: any): Promise<T> {
    // Get auth headers
    const headers = await this.getAuthHeaders();
    
    // Make request
    const response = await fetch(this.baseUrl + endpoint, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data)
    });
    
    return this.handleResponse<T>(response);
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    // Get auth headers
    const headers = await this.getAuthHeaders();
    
    // Make request
    const response = await fetch(this.baseUrl + endpoint, {
      method: 'DELETE',
      headers
    });
    
    return this.handleResponse<T>(response);
  }

  /**
   * Upload file with authentication
   */
  async uploadFile<T>(endpoint: string, file: File, additionalData: Record<string, any> = {}): Promise<T> {
    // Get auth headers (without content-type, let browser set it)
    const authHeaders = await this.getAuthHeaders();
    const { 'Content-Type': _, ...headers } = authHeaders;
    
    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    
    // Add additional data
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, typeof value === 'string' ? value : JSON.stringify(value));
    });
    
    // Make request
    const response = await fetch(this.baseUrl + endpoint, {
      method: 'POST',
      headers,
      body: formData
    });
    
    return this.handleResponse<T>(response);
  }
}

// Create and export a singleton instance
export const httpClient = new HttpClient();