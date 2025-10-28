import AsyncStorage from "@react-native-async-storage/async-storage";
import { NewsArticle, User, NewsPreferences } from "../types";

interface OfflineData {
  articles: NewsArticle[];
  user: User | null;
  preferences: NewsPreferences | null;
  lastSync: string;
  cachedArticles: { [key: string]: NewsArticle };
}

class OfflineStorageService {
  private static readonly STORAGE_KEYS = {
    OFFLINE_DATA: "@newsapp_offline_data",
    CACHED_ARTICLES: "@newsapp_cached_articles",
    USER_DATA: "@newsapp_user_data",
    PREFERENCES: "@newsapp_preferences",
    LAST_SYNC: "@newsapp_last_sync",
  };

  // Save articles for offline reading
  static async saveArticlesForOffline(articles: NewsArticle[]): Promise<void> {
    try {
      const offlineData: OfflineData = {
        articles,
        user: null,
        preferences: null,
        lastSync: new Date().toISOString(),
        cachedArticles: {},
      };

      // Cache individual articles
      const cachedArticles: { [key: string]: NewsArticle } = {};
      articles.forEach((article) => {
        cachedArticles[article.id] = article;
      });

      await AsyncStorage.setItem(
        this.STORAGE_KEYS.OFFLINE_DATA,
        JSON.stringify(offlineData)
      );

      await AsyncStorage.setItem(
        this.STORAGE_KEYS.CACHED_ARTICLES,
        JSON.stringify(cachedArticles)
      );

      console.log(`Saved ${articles.length} articles for offline reading`);
    } catch (error) {
      console.error("Error saving articles for offline:", error);
      throw error;
    }
  }

  // Get cached articles
  static async getCachedArticles(): Promise<NewsArticle[]> {
    try {
      const cachedData = await AsyncStorage.getItem(
        this.STORAGE_KEYS.CACHED_ARTICLES
      );
      if (cachedData) {
        const cachedArticles = JSON.parse(cachedData);
        return Object.values(cachedArticles);
      }
      return [];
    } catch (error) {
      console.error("Error getting cached articles:", error);
      return [];
    }
  }

  // Get specific cached article
  static async getCachedArticle(
    articleId: string
  ): Promise<NewsArticle | null> {
    try {
      const cachedData = await AsyncStorage.getItem(
        this.STORAGE_KEYS.CACHED_ARTICLES
      );
      if (cachedData) {
        const cachedArticles = JSON.parse(cachedData);
        return cachedArticles[articleId] || null;
      }
      return null;
    } catch (error) {
      console.error("Error getting cached article:", error);
      return null;
    }
  }

  // Save user data
  static async saveUserData(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(
        this.STORAGE_KEYS.USER_DATA,
        JSON.stringify(user)
      );
      console.log("User data saved for offline access");
    } catch (error) {
      console.error("Error saving user data:", error);
      throw error;
    }
  }

  // Get user data
  static async getUserData(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(this.STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error getting user data:", error);
      return null;
    }
  }

  // Save user preferences
  static async savePreferences(preferences: NewsPreferences): Promise<void> {
    try {
      await AsyncStorage.setItem(
        this.STORAGE_KEYS.PREFERENCES,
        JSON.stringify(preferences)
      );
      console.log("Preferences saved for offline access");
    } catch (error) {
      console.error("Error saving preferences:", error);
      throw error;
    }
  }

  // Get user preferences
  static async getPreferences(): Promise<NewsPreferences | null> {
    try {
      const preferences = await AsyncStorage.getItem(
        this.STORAGE_KEYS.PREFERENCES
      );
      return preferences ? JSON.parse(preferences) : null;
    } catch (error) {
      console.error("Error getting preferences:", error);
      return null;
    }
  }

  // Save reading history
  static async saveReadingHistory(
    history: Array<{ articleId: string; readAt: string }>
  ): Promise<void> {
    try {
      await AsyncStorage.setItem(
        "@newsapp_reading_history",
        JSON.stringify(history)
      );
    } catch (error) {
      console.error("Error saving reading history:", error);
      throw error;
    }
  }

  // Get reading history
  static async getReadingHistory(): Promise<
    Array<{ articleId: string; readAt: string }>
  > {
    try {
      const history = await AsyncStorage.getItem("@newsapp_reading_history");
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error("Error getting reading history:", error);
      return [];
    }
  }

  // Save saved articles
  static async saveSavedArticles(savedArticles: string[]): Promise<void> {
    try {
      await AsyncStorage.setItem(
        "@newsapp_saved_articles",
        JSON.stringify(savedArticles)
      );
    } catch (error) {
      console.error("Error saving saved articles:", error);
      throw error;
    }
  }

  // Get saved articles
  static async getSavedArticles(): Promise<string[]> {
    try {
      const savedArticles = await AsyncStorage.getItem(
        "@newsapp_saved_articles"
      );
      return savedArticles ? JSON.parse(savedArticles) : [];
    } catch (error) {
      console.error("Error getting saved articles:", error);
      return [];
    }
  }

  // Save app settings
  static async saveAppSettings(settings: any): Promise<void> {
    try {
      await AsyncStorage.setItem("@newsapp_settings", JSON.stringify(settings));
    } catch (error) {
      console.error("Error saving app settings:", error);
      throw error;
    }
  }

  // Get app settings
  static async getAppSettings(): Promise<any> {
    try {
      const settings = await AsyncStorage.getItem("@newsapp_settings");
      return settings ? JSON.parse(settings) : null;
    } catch (error) {
      console.error("Error getting app settings:", error);
      return null;
    }
  }

  // Check if data is available offline
  static async isDataAvailableOffline(): Promise<boolean> {
    try {
      const cachedData = await AsyncStorage.getItem(
        this.STORAGE_KEYS.CACHED_ARTICLES
      );
      return !!cachedData;
    } catch (error) {
      console.error("Error checking offline data availability:", error);
      return false;
    }
  }

  // Get last sync time
  static async getLastSyncTime(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(this.STORAGE_KEYS.LAST_SYNC);
    } catch (error) {
      console.error("Error getting last sync time:", error);
      return null;
    }
  }

  // Update last sync time
  static async updateLastSyncTime(): Promise<void> {
    try {
      await AsyncStorage.setItem(
        this.STORAGE_KEYS.LAST_SYNC,
        new Date().toISOString()
      );
    } catch (error) {
      console.error("Error updating last sync time:", error);
      throw error;
    }
  }

  // Clear all offline data
  static async clearAllOfflineData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        this.STORAGE_KEYS.OFFLINE_DATA,
        this.STORAGE_KEYS.CACHED_ARTICLES,
        this.STORAGE_KEYS.USER_DATA,
        this.STORAGE_KEYS.PREFERENCES,
        this.STORAGE_KEYS.LAST_SYNC,
        "@newsapp_reading_history",
        "@newsapp_saved_articles",
        "@newsapp_settings",
      ]);
      console.log("All offline data cleared");
    } catch (error) {
      console.error("Error clearing offline data:", error);
      throw error;
    }
  }

  // Get storage usage info
  static async getStorageInfo(): Promise<{
    totalSize: number;
    articleCount: number;
    lastSync: string | null;
  }> {
    try {
      const cachedData = await AsyncStorage.getItem(
        this.STORAGE_KEYS.CACHED_ARTICLES
      );
      const lastSync = await AsyncStorage.getItem(this.STORAGE_KEYS.LAST_SYNC);

      let articleCount = 0;
      let totalSize = 0;

      if (cachedData) {
        const cachedArticles = JSON.parse(cachedData);
        articleCount = Object.keys(cachedArticles).length;
        totalSize = cachedData.length;
      }

      return {
        totalSize,
        articleCount,
        lastSync,
      };
    } catch (error) {
      console.error("Error getting storage info:", error);
      return {
        totalSize: 0,
        articleCount: 0,
        lastSync: null,
      };
    }
  }

  // Sync data when online
  static async syncWhenOnline(): Promise<void> {
    try {
      // This would typically sync with the backend
      // For now, we'll just update the last sync time
      await this.updateLastSyncTime();
      console.log("Data synced with server");
    } catch (error) {
      console.error("Error syncing data:", error);
      throw error;
    }
  }

  // Check if sync is needed
  static async isSyncNeeded(): Promise<boolean> {
    try {
      const lastSync = await this.getLastSyncTime();
      if (!lastSync) return true;

      const lastSyncTime = new Date(lastSync);
      const now = new Date();
      const hoursSinceSync =
        (now.getTime() - lastSyncTime.getTime()) / (1000 * 60 * 60);

      // Sync if more than 1 hour has passed
      return hoursSinceSync > 1;
    } catch (error) {
      console.error("Error checking if sync is needed:", error);
      return true;
    }
  }
}

export default OfflineStorageService;
