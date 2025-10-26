import { NewsArticle, NewsPreferences } from '../types';
import apiService from './apiService';

export class NewsService {
  static async getTopHeadlines(): Promise<NewsArticle[]> {
    try {
      const response = await apiService.getTopHeadlines();
      
      if (response.success) {
        return response.articles.map(article => this.transformBackendArticle(article));
      }
      
      throw new Error(response.error || 'Failed to fetch headlines');
    } catch (error: any) {
      console.error('Error fetching headlines:', error.message);
      throw new Error(error.message || 'Failed to fetch headlines');
    }
  }

  static async searchNews(query: string): Promise<NewsArticle[]> {
    try {
      if (!query) {
        throw new Error('Search query is required');
      }
      const response = await apiService.searchNews(query);
      
      if (response.success) {
        return response.articles.map(article => this.transformBackendArticle(article));
      }
      
      throw new Error(response.error || 'Failed to search news');
    } catch (error: any) {
      console.error('Error searching news:', error.message);
      throw new Error(error.message || 'Failed to search news');
    }
  }

  static async getArticlesByCategory(category: string): Promise<NewsArticle[]> {
    try {
      if (!category) {
        throw new Error('Category is required');
      }
      const response = await apiService.getArticlesByCategory(category);
      
      if (response.success) {
        return response.articles.map(article => this.transformBackendArticle(article));
      }
      
      throw new Error(response.error || 'Failed to fetch articles by category');
    } catch (error: any) {
      console.error('Error fetching articles by category:', error.message);
      throw new Error(error.message || 'Failed to fetch articles by category');
    }
  }

  static async getArticlesBySource(source: string): Promise<NewsArticle[]> {
    try {
      if (!source) {
        throw new Error('Source is required');
      }
      const response = await apiService.getArticlesBySource(source);
      
      if (response.success) {
        return response.articles.map(article => this.transformBackendArticle(article));
      }
      
      throw new Error(response.error || 'Failed to fetch articles by source');
    } catch (error: any) {
      console.error('Error fetching articles by source:', error.message);
      throw new Error(error.message || 'Failed to fetch articles by source');
    }
  }

  static async getCategories(): Promise<string[]> {
    try {
      const response = await apiService.getCategories();
      
      if (response.success) {
        return response.categories || [];
      }
      
      throw new Error(response.error || 'Failed to fetch categories');
    } catch (error: any) {
      console.error('Error fetching categories:', error.message);
      throw new Error(error.message || 'Failed to fetch categories');
    }
  }

  static async getSources(): Promise<string[]> {
    try {
      const response = await apiService.getSources();
      
      if (response.success) {
        return response.sources || [];
      }
      
      throw new Error(response.error || 'Failed to fetch sources');
    } catch (error: any) {
      console.error('Error fetching sources:', error.message);
      throw new Error(error.message || 'Failed to fetch sources');
    }
  }

  static async getArticleById(id: string): Promise<NewsArticle | null> {
    try {
      if (!id) {
        throw new Error('Article ID is required');
      }
      const response = await apiService.getArticleById(id);
      
      if (response.success) {
        return this.transformBackendArticle(response.article);
      }
      
      throw new Error(response.error || 'Failed to fetch article');
    } catch (error: any) {
      console.error('Error fetching article by ID:', error.message);
      throw new Error(error.message || 'Failed to fetch article');
    }
  }

  private static transformBackendArticle(backendArticle: any): NewsArticle {
    return {
      id: backendArticle._id || backendArticle.externalId || '',
      title: backendArticle.title || 'No title available',
      description: backendArticle.description || 'No description available',
      content: backendArticle.content || 'No content available',
      url: backendArticle.url || '',
      imageUrl: backendArticle.imageUrl || 'https://picsum.photos/400/600',
      publishedAt: backendArticle.publishedAt || new Date().toISOString(),
      source: backendArticle.source?.name || 'Unknown Source',
      category: backendArticle.category || 'General',
      author: backendArticle.author || 'Unknown Author',
      readTime: backendArticle.readTime || 1,
      credits: backendArticle.credits || 5,
    };
  }

  static getMockArticles(): NewsArticle[] {
    if (!__DEV__) {
      return [];
    }
    return [
      {
        id: '1',
        title: 'Revolutionary AI Technology Transforms Healthcare Industry',
        description: 'New artificial intelligence breakthrough promises to revolutionize medical diagnosis and treatment, potentially saving millions of lives worldwide.',
        content: 'In a groundbreaking development that could reshape the future of healthcare, researchers have unveiled a revolutionary AI system capable of diagnosing diseases with unprecedented accuracy...',
        url: 'https://example.com/ai-healthcare-breakthrough',
        imageUrl: 'https://picsum.photos/400/600?random=1',
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        source: 'Tech News Daily',
        category: 'Technology',
        author: 'Dr. Sarah Johnson',
        readTime: 6,
        credits: 15,
      },
      {
        id: '2',
        title: 'Global Climate Summit Reaches Historic Agreement on Carbon Reduction',
        description: 'World leaders have reached a landmark agreement to accelerate carbon reduction efforts, setting ambitious new targets for the next decade.',
        content: 'In a historic moment for global environmental policy, representatives from 195 countries have reached an unprecedented agreement on carbon reduction targets...',
        url: 'https://example.com/climate-summit-agreement',
        imageUrl: 'https://picsum.photos/400/600?random=2',
        publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        source: 'Global News Network',
        category: 'Environment',
        author: 'Michael Chen',
        readTime: 8,
        credits: 20,
      },
    ];
  }
}