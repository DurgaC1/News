// API Service for communicating with the backend
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api'  // Development
  : 'https://your-production-api.com/api'; // Production

class APIService {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async loginAsDeveloper() {
    return this.request('/auth/developer', { method: 'POST' });
  }

  async loginAsGuest() {
    return this.request('/auth/guest', { method: 'POST' });
  }

  async loginWithGoogle(userData: any) {
    return this.request('/auth/google', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async loginWithFacebook(userData: any) {
    return this.request('/auth/facebook', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async verifyToken() {
    return this.request('/auth/verify');
  }

  // News endpoints
  async getTopHeadlines() {
    return this.request('/news');
  }

  async searchNews(query: string) {
    return this.request(`/news/search?q=${encodeURIComponent(query)}`);
  }

  async getArticlesByCategory(category: string) {
    return this.request(`/news/category/${category}`);
  }

  async getArticlesBySource(source: string) {
    return this.request(`/news/source/${source}`);
  }

  async getCategories() {
    return this.request('/news/categories');
  }

  async getSources() {
    return this.request('/news/sources');
  }

  // Article endpoints
  async getArticleById(id: string) {
    return this.request(`/news/${id}`);
  }
}

export default new APIService();

