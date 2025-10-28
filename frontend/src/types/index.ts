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
  trendingScore?: number;
  engagementScore?: number;
  tags?: string[];
  relatedArticles?: string[];
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

export type ViewMode = "card" | "newspaper" | "vertical" | "audio";

export interface ReadingMode {
  mode: ViewMode;
  autoScroll: boolean;
  fontSize: "small" | "medium" | "large";
  darkMode: boolean;
}

export interface AudioSettings {
  enabled: boolean;
  voice: string;
  speed: number;
  pitch: number;
}

export interface UserInteraction {
  articleId: string;
  liked: boolean;
  disliked: boolean;
  saved: boolean;
  shared: boolean;
  readTime: number;
  timestamp: string;
}

export interface NotificationSettings {
  dailyDigest: boolean;
  breakingNews: boolean;
  personalizedAlerts: boolean;
  pushNotifications: boolean;
}

export interface AppSettings {
  readingMode: ReadingMode;
  audioSettings: AudioSettings;
  notifications: NotificationSettings;
  offlineMode: boolean;
  autoRefresh: boolean;
  refreshInterval: number; // in minutes
}
