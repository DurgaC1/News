import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { NewsArticle } from "../types";
import { MockDataService } from "./mockDataService";

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

interface NotificationSettings {
  dailyDigest: boolean;
  breakingNews: boolean;
  personalizedAlerts: boolean;
  pushNotifications: boolean;
  digestTime: string; // Format: "HH:MM"
}

class NotificationService {
  private static instance: NotificationService;
  private notificationSettings: NotificationSettings = {
    dailyDigest: true,
    breakingNews: true,
    personalizedAlerts: true,
    pushNotifications: true,
    digestTime: "08:00",
  };

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Request notification permissions
  async requestPermissions(): Promise<boolean> {
    try {
      if (!Device.isDevice) {
        console.log("Must use physical device for Push Notifications");
        return false;
      }

      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.log("Failed to get push token for push notification!");
        return false;
      }

      // Get the push token
      const token = await Notifications.getExpoPushTokenAsync();
      console.log("Push token:", token.data);

      // Configure notification channel for Android
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });

        await Notifications.setNotificationChannelAsync("breaking-news", {
          name: "Breaking News",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
          sound: "default",
        });

        await Notifications.setNotificationChannelAsync("daily-digest", {
          name: "Daily Digest",
          importance: Notifications.AndroidImportance.DEFAULT,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }

      return true;
    } catch (error) {
      console.error("Error requesting notification permissions:", error);
      return false;
    }
  }

  // Schedule daily digest notification
  async scheduleDailyDigest(): Promise<void> {
    try {
      if (!this.notificationSettings.dailyDigest) return;

      // Cancel existing daily digest
      await Notifications.cancelScheduledNotificationAsync("daily-digest");

      // Parse digest time
      const [hours, minutes] = this.notificationSettings.digestTime
        .split(":")
        .map(Number);

      // Create trigger for daily notification
      const trigger: Notifications.DailyTriggerInput = {
        hour: hours,
        minute: minutes,
        repeats: true,
      };

      // Get trending articles for digest
      const trendingArticles = MockDataService.getTrendingArticles().slice(
        0,
        3
      );
      const digestContent = trendingArticles
        .map((article) => `• ${article.title}`)
        .join("\n");

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "📰 Your Daily News Digest",
          body: `Top stories today:\n${digestContent}`,
          data: { type: "daily-digest" },
          sound: "default",
        },
        trigger,
        identifier: "daily-digest",
      });

      console.log("Daily digest notification scheduled");
    } catch (error) {
      console.error("Error scheduling daily digest:", error);
    }
  }

  // Send breaking news notification
  async sendBreakingNewsNotification(article: NewsArticle): Promise<void> {
    try {
      if (!this.notificationSettings.breakingNews) return;

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "🚨 Breaking News",
          body: article.title,
          data: {
            type: "breaking-news",
            articleId: article.id,
          },
          sound: "default",
        },
        trigger: null, // Send immediately
        identifier: `breaking-news-${article.id}`,
      });

      console.log("Breaking news notification sent");
    } catch (error) {
      console.error("Error sending breaking news notification:", error);
    }
  }

  // Send personalized alert
  async sendPersonalizedAlert(
    article: NewsArticle,
    reason: string
  ): Promise<void> {
    try {
      if (!this.notificationSettings.personalizedAlerts) return;

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "📱 News Alert",
          body: `${reason}: ${article.title}`,
          data: {
            type: "personalized",
            articleId: article.id,
            reason,
          },
          sound: "default",
        },
        trigger: null, // Send immediately
        identifier: `personalized-${article.id}`,
      });

      console.log("Personalized alert sent");
    } catch (error) {
      console.error("Error sending personalized alert:", error);
    }
  }

  // Send article saved notification
  async sendArticleSavedNotification(article: NewsArticle): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "✅ Article Saved",
          body: `"${article.title}" has been saved to your reading list`,
          data: {
            type: "article-saved",
            articleId: article.id,
          },
        },
        trigger: null,
        identifier: `saved-${article.id}`,
      });
    } catch (error) {
      console.error("Error sending article saved notification:", error);
    }
  }

  // Send reading milestone notification
  async sendReadingMilestoneNotification(milestone: string): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "🎉 Reading Milestone",
          body: `Congratulations! You've ${milestone}`,
          data: { type: "milestone" },
        },
        trigger: null,
        identifier: `milestone-${Date.now()}`,
      });
    } catch (error) {
      console.error("Error sending milestone notification:", error);
    }
  }

  // Update notification settings
  updateSettings(settings: Partial<NotificationSettings>): void {
    this.notificationSettings = { ...this.notificationSettings, ...settings };

    // Reschedule daily digest if time changed
    if (settings.digestTime) {
      this.scheduleDailyDigest();
    }
  }

  // Get current notification settings
  getSettings(): NotificationSettings {
    return { ...this.notificationSettings };
  }

  // Cancel all scheduled notifications
  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log("All notifications cancelled");
    } catch (error) {
      console.error("Error cancelling notifications:", error);
    }
  }

  // Cancel specific notification
  async cancelNotification(identifier: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(identifier);
    } catch (error) {
      console.error("Error cancelling notification:", error);
    }
  }

  // Get pending notifications
  async getPendingNotifications(): Promise<
    Notifications.NotificationRequest[]
  > {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error("Error getting pending notifications:", error);
      return [];
    }
  }

  // Handle notification response
  handleNotificationResponse(
    response: Notifications.NotificationResponse
  ): void {
    const { data } = response.notification.request.content;

    switch (data?.type) {
      case "daily-digest":
        // Navigate to news feed
        console.log("Daily digest tapped");
        break;
      case "breaking-news":
        // Navigate to specific article
        console.log("Breaking news tapped:", data.articleId);
        break;
      case "personalized":
        // Navigate to specific article
        console.log("Personalized alert tapped:", data.articleId);
        break;
      case "article-saved":
        // Navigate to saved articles
        console.log("Article saved notification tapped");
        break;
      case "milestone":
        // Show milestone achievement
        console.log("Milestone notification tapped");
        break;
      default:
        console.log("Unknown notification type tapped");
    }
  }

  // Check if notifications are enabled
  async areNotificationsEnabled(): Promise<boolean> {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      return status === "granted";
    } catch (error) {
      console.error("Error checking notification permissions:", error);
      return false;
    }
  }

  // Send test notification
  async sendTestNotification(): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Test Notification",
          body: "This is a test notification from NewsFlow",
          data: { type: "test" },
        },
        trigger: { seconds: 2 },
        identifier: "test-notification",
      });
    } catch (error) {
      console.error("Error sending test notification:", error);
    }
  }

  // Schedule weekly reading summary
  async scheduleWeeklySummary(): Promise<void> {
    try {
      // Schedule for every Sunday at 9 AM
      const trigger: Notifications.WeeklyTriggerInput = {
        weekday: 1, // Sunday
        hour: 9,
        minute: 0,
        repeats: true,
      };

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "📊 Weekly Reading Summary",
          body: "Check out your reading statistics for this week!",
          data: { type: "weekly-summary" },
        },
        trigger,
        identifier: "weekly-summary",
      });

      console.log("Weekly summary notification scheduled");
    } catch (error) {
      console.error("Error scheduling weekly summary:", error);
    }
  }

  // Send offline mode notification
  async sendOfflineModeNotification(): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "📱 Offline Mode Active",
          body: "You can now read articles without an internet connection",
          data: { type: "offline-mode" },
        },
        trigger: null,
        identifier: "offline-mode",
      });
    } catch (error) {
      console.error("Error sending offline mode notification:", error);
    }
  }
}

export default NotificationService.getInstance();
