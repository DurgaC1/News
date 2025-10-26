export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  imageUrl: string;
  publishedAt: string;
  source: string;
  category: string;
  author: string;
  readTime: number;
  credits: number;
}

export interface NewsPreferences {
  categories: string[];
  sources: string[];
  languages: string[];
  countries: string[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  preferences: NewsPreferences;
  credits: number;
  savedArticles: string[];
  readingHistory: Array<{
    articleId: string;
    readAt: string;
  }>;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (user: User) => Promise<void>;
  loginAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
}

export interface NewsContextType {
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

export interface CreditsContextType {
  credits: number;
  addCredits: (amount: number) => void;
  deductCredits: (amount: number) => void;
}
