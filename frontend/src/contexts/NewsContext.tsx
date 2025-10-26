import React, { createContext, useContext, useState, ReactNode } from 'react';
import { NewsArticle } from '../types';
import { NewsService } from '../services/newsService';
import { useAuth } from './AuthContext';

interface NewsContextType {
  articles: NewsArticle[];
  currentIndex: number;
  isLoading: boolean;
  error: string | null;
  nextArticle: () => void;
  previousArticle: () => void;
  saveArticle: (articleId: string) => Promise<void>;
  addToHistory: (articleId: string) => Promise<void>;
  searchNews: (query: string) => Promise<void>;
  refreshNews: () => Promise<void>;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export const useNews = () => {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  return context;
};

interface NewsProviderProps {
  children: ReactNode;
}

export const NewsProvider: React.FC<NewsProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadArticles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const preferences = user?.preferences || { categories: [], sources: [], languages: [], countries: [] };
      const headlines = await NewsService.getTopHeadlines(preferences);
      if (headlines.length > 0) {
        setArticles(headlines);
      } else {
        // Fallback to mock articles
        setArticles(NewsService.getMockArticles());
      }
    } catch (err) {
      setError('Failed to load news');
      // Use mock articles as fallback
      setArticles(NewsService.getMockArticles());
    } finally {
      setIsLoading(false);
    }
  };

  const nextArticle = () => {
    setCurrentIndex((prev) => (prev + 1) % articles.length);
  };

  const previousArticle = () => {
    setCurrentIndex((prev) => (prev - 1 + articles.length) % articles.length);
  };

  const saveArticle = async (articleId: string) => {
    // Implementation for saving articles
    console.log('Saving article:', articleId);
  };

  const addToHistory = async (articleId: string) => {
    // Implementation for adding to history
    console.log('Adding to history:', articleId);
  };

  const searchNews = async (query: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const preferences = user?.preferences || { categories: [], sources: [], languages: [], countries: [] };
      const results = await NewsService.searchNews(query, preferences);
      if (results.length > 0) {
        setArticles(results);
        setCurrentIndex(0);
      }
    } catch (err) {
      setError('Search failed');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshNews = async () => {
    await loadArticles();
  };

  // Load articles on mount and when user changes
  React.useEffect(() => {
    loadArticles();
  }, [user]);

  return (
    <NewsContext.Provider
      value={{
        articles,
        currentIndex,
        isLoading,
        error,
        nextArticle,
        previousArticle,
        saveArticle,
        addToHistory,
        searchNews,
        refreshNews,
      }}
    >
      {children}
    </NewsContext.Provider>
  );
};

