import { NewsArticle, NewsPreferences } from '../types';
import apiService from './apiService';

export class NewsService {
  static async getTopHeadlines(preferences: NewsPreferences): Promise<NewsArticle[]> {
    try {
      const response = await apiService.getTopHeadlines();
      
      if (response.success) {
        return response.articles.map(article => this.transformBackendArticle(article));
      } else {
        console.error('Failed to fetch headlines');
        return [];
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      return [];
    }
  }

  static async searchNews(query: string, preferences: NewsPreferences): Promise<NewsArticle[]> {
    try {
      const response = await apiService.searchNews(query);
      
      if (response.success) {
        return response.articles.map(article => this.transformBackendArticle(article));
      } else {
        console.error('Failed to search news');
        return [];
      }
    } catch (error) {
      console.error('Error searching news:', error);
      return [];
    }
  }

  static async getArticlesByCategory(category: string): Promise<NewsArticle[]> {
    try {
      const response = await apiService.getArticlesByCategory(category);
      
      if (response.success) {
        return response.articles.map(article => this.transformBackendArticle(article));
      } else {
        console.error('Failed to fetch articles by category');
        return [];
      }
    } catch (error) {
      console.error('Error fetching articles by category:', error);
      return [];
    }
  }

  static async getArticlesBySource(source: string): Promise<NewsArticle[]> {
    try {
      const response = await apiService.getArticlesBySource(source);
      
      if (response.success) {
        return response.articles.map(article => this.transformBackendArticle(article));
      } else {
        console.error('Failed to fetch articles by source');
        return [];
      }
    } catch (error) {
      console.error('Error fetching articles by source:', error);
      return [];
    }
  }

  static async getCategories(): Promise<string[]> {
    try {
      const response = await apiService.getCategories();
      
      if (response.success) {
        return response.categories;
      } else {
        console.error('Failed to fetch categories');
        return [];
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  static async getSources(): Promise<string[]> {
    try {
      const response = await apiService.getSources();
      
      if (response.success) {
        return response.sources;
      } else {
        console.error('Failed to fetch sources');
        return [];
      }
    } catch (error) {
      console.error('Error fetching sources:', error);
      return [];
    }
  }

  // Transform backend article format to frontend format
  private static transformBackendArticle(backendArticle: any): NewsArticle {
    return {
      id: backendArticle._id || backendArticle.externalId,
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

  // Fallback mock articles for development
  static getMockArticles(): NewsArticle[] {
    return [
      {
        id: '1',
        title: 'Revolutionary AI Technology Transforms Healthcare Industry',
        description: 'New artificial intelligence breakthrough promises to revolutionize medical diagnosis and treatment, potentially saving millions of lives worldwide.',
        content: 'In a groundbreaking development that could reshape the future of healthcare, researchers have unveiled a revolutionary AI system capable of diagnosing diseases with unprecedented accuracy. The technology, developed over five years by a team of leading scientists, combines machine learning algorithms with advanced medical imaging to identify conditions that were previously difficult to detect in early stages. Early trials have shown remarkable results, with the AI system achieving 98% accuracy in diagnosing various cancers, heart conditions, and neurological disorders. The implications of this breakthrough extend far beyond diagnosis, as the system can also recommend personalized treatment plans based on individual patient data. Healthcare providers worldwide are already expressing interest in implementing this technology, which could significantly reduce medical errors and improve patient outcomes. The development team is now working on expanding the system\'s capabilities to include drug discovery and treatment optimization.',
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
        content: 'In a historic moment for global environmental policy, representatives from 195 countries have reached an unprecedented agreement on carbon reduction targets at the annual Climate Summit. The new agreement, dubbed the "Paris Plus Protocol," sets even more ambitious goals than the original Paris Agreement, calling for a 50% reduction in global carbon emissions by 2030. The agreement includes specific commitments from major industrialized nations, with the United States, European Union, and China pledging to achieve carbon neutrality by 2040. Developing nations have also committed to significant reductions, with financial support from wealthier countries to help transition to renewable energy sources. The agreement includes innovative mechanisms for carbon trading and technology transfer, ensuring that all nations can participate in the global effort to combat climate change. Environmental activists have praised the agreement as a crucial step forward, while acknowledging that implementation will be the true test of its effectiveness.',
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
