// API Service for communicating with the backend
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3001/api'  // Development
  : 'https://your-production-api.com/api'; // Production

interface APIResponse<T> {
  success: boolean;
  [key: string]: any; // Flexible to accommodate error messages, user data, articles, etc.
  data?: T; // Generic type for successful response data
}

interface UserCredentials {
  email: string;
  password: string;
}

interface UserSignupInfo {
  email: string;
  password: string;
  name: string;
}

interface SocialUserData {
  email: string;
  name: string;
  picture?: string;
  googleId?: string;
  facebookId?: string;
}

interface UserPreferences {
  categories?: string[];
  sources?: string[];
  languages?: string[];
  countries?: string[];
}

interface Article {
  id: string;
  // Add other article properties as needed
}

interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar: string;
  credits: number;
  preferences: UserPreferences;
  savedArticles: string[];
  readingHistory: { articleId: string; readAt: string }[];
}

class APIService {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<APIResponse<T>> {
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

      const data: APIResponse<T> = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API request error for ${endpoint}:`, error);
      throw error;
    }
  }

  // Auth endpoints
  async loginAsDeveloper(): Promise<APIResponse<{ token: string; user: UserProfile }>> {
    return this.request('/auth/developer', { method: 'POST' });
  }

  async loginAsGuest(): Promise<APIResponse<{ token: string; user: UserProfile }>> {
    return this.request('/auth/guest', { method: 'POST' });
  }

  async loginWithEmail(credentials: UserCredentials): Promise<APIResponse<{ token: string; user: UserProfile }>> {
    return this.request('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async signupWithEmail(userInfo: UserSignupInfo): Promise<APIResponse<{ token: string; user: UserProfile }>> {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userInfo),
    });
  }

  async loginWithGoogle(userData: SocialUserData): Promise<APIResponse<{ token: string; user: UserProfile }>> {
    return this.request('/auth/google', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async loginWithFacebook(userData: SocialUserData): Promise<APIResponse<{ token: string; user: UserProfile }>> {
    return this.request('/auth/facebook', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async verifyToken(): Promise<APIResponse<{ user: UserProfile }>> {
    return this.request('/auth/verify');
  }

  // News endpoints
  async getTopHeadlines(): Promise<APIResponse<{ count: number; articles: Article[] }>> {
    return this.request('/news/headlines'); // Corrected from /news to /news/headlines
  }

  async searchNews(query: string): Promise<APIResponse<{ count: number; query: string; articles: Article[] }>> {
    return this.request(`/news/search?q=${encodeURIComponent(query)}`);
  }

  async getArticlesByCategory(category: string): Promise<APIResponse<{ count: number; category: string; articles: Article[] }>> {
    return this.request(`/news/category/${category}`);
  }

  async getArticlesBySource(source: string): Promise<APIResponse<{ count: number; source: string; articles: Article[] }>> {
    return this.request(`/news/source/${source}`);
  }

  async getCategories(): Promise<APIResponse<{ categories: string[] }>> {
    return this.request('/news/categories');
  }

  async getSources(): Promise<APIResponse<{ sources: string[] }>> {
    return this.request('/news/sources');
  }

  // Article endpoints
  async getArticleById(id: string): Promise<APIResponse<Article>> {
    return this.request(`/news/${id}`);
  }

  // User endpoints
  async getUserProfile(): Promise<APIResponse<{ user: UserProfile }>> {
    return this.request('/user/profile');
  }

  async updatePreferences(preferences: UserPreferences): Promise<APIResponse<{ user: UserProfile }>> {
    return this.request('/user/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });
  }

  async updateProfile(profile: { name?: string; avatar?: string }): Promise<APIResponse<{ user: UserProfile }>> {
    return this.request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
  }

  async changePassword(passwords: { currentPassword: string; newPassword: string }): Promise<APIResponse<{ message: string }>> {
    return this.request('/user/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwords),
    });
  }

  async saveArticle(articleId: string): Promise<APIResponse<{ message: string; savedArticles: string[] }>> {
    return this.request('/user/save-article', {
      method: 'POST',
      body: JSON.stringify({ articleId }),
    });
  }

  async removeSavedArticle(articleId: string): Promise<APIResponse<{ message: string; savedArticles: string[] }>> {
    return this.request(`/user/save-article/${articleId}`, {
      method: 'DELETE',
    });
  }

  async addToReadingHistory(articleId: string): Promise<APIResponse<{ message: string; readingHistory: { articleId: string; readAt: string }[] }>> {
    return this.request('/user/reading-history', {
      method: 'POST',
      body: JSON.stringify({ articleId }),
    });
  }

  async getSavedArticles(): Promise<APIResponse<{ articles: string[] }>> {
    return this.request('/user/saved-articles');
  }

  async getReadingHistory(): Promise<APIResponse<{ readingHistory: { articleId: string; readAt: string }[] }>> {
    return this.request('/user/reading-history');
  }
}

export default new APIService();