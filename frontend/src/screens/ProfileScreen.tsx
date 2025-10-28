import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import {
  User,
  AppSettings,
  ReadingMode,
  AudioSettings,
  NotificationSettings,
} from "../types";

const { width } = Dimensions.get("window");

interface ProfileScreenProps {
  user: User;
  onLogout: () => void;
  onUpdatePreferences: (preferences: any) => void;
  onUpdateSettings: (settings: AppSettings) => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  onLogout,
  onUpdatePreferences,
  onUpdateSettings,
}) => {
  const [settings, setSettings] = useState<AppSettings>({
    readingMode: {
      mode: "card",
      autoScroll: false,
      fontSize: "medium",
      darkMode: false,
    },
    audioSettings: {
      enabled: false,
      voice: "default",
      speed: 1.0,
      pitch: 1.0,
    },
    notifications: {
      dailyDigest: true,
      breakingNews: true,
      personalizedAlerts: true,
      pushNotifications: true,
    },
    offlineMode: false,
    autoRefresh: true,
    refreshInterval: 30,
  });

  const [showSettings, setShowSettings] = useState(false);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: onLogout },
    ]);
  };

  const updateSetting = (key: keyof AppSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onUpdateSettings(newSettings);
  };

  const updateNestedSetting = (
    parentKey: keyof AppSettings,
    childKey: string,
    value: any
  ) => {
    const newSettings = {
      ...settings,
      [parentKey]: {
        ...settings[parentKey],
        [childKey]: value,
      },
    };
    setSettings(newSettings);
    onUpdateSettings(newSettings);
  };

  const getReadingStats = () => {
    const totalArticles = user.readingHistory.length;
    const totalReadTime = user.readingHistory.reduce((acc, item) => acc + 5, 0); // Assuming 5 min average
    const savedCount = user.savedArticles.length;
    const categoriesRead = [
      ...new Set(user.readingHistory.map(() => "Technology")),
    ].length;

    return { totalArticles, totalReadTime, savedCount, categoriesRead };
  };

  const stats = getReadingStats();

  const renderStatCard = (
    title: string,
    value: string | number,
    icon: string,
    color: string
  ) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statContent}>
        <Ionicons name={icon as any} size={24} color={color} />
        <View style={styles.statText}>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statTitle}>{title}</Text>
        </View>
      </View>
    </View>
  );

  const renderSettingItem = (
    title: string,
    subtitle: string,
    value: boolean,
    onValueChange: (value: boolean) => void,
    icon: string
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingContent}>
        <Ionicons name={icon as any} size={24} color="#667eea" />
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#e0e0e0", true: "#667eea" }}
        thumbColor={value ? "#fff" : "#f4f3f4"}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.header}>
        <View style={styles.profileInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <View style={styles.creditsContainer}>
            <Ionicons name="star" size={16} color="#ffa502" />
            <Text style={styles.creditsText}>{user.credits} Credits</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reading Statistics</Text>
          <View style={styles.statsGrid}>
            {renderStatCard(
              "Articles Read",
              stats.totalArticles,
              "newspaper",
              "#667eea"
            )}
            {renderStatCard(
              "Reading Time",
              `${stats.totalReadTime}m`,
              "time",
              "#ff6b6b"
            )}
            {renderStatCard(
              "Saved Articles",
              stats.savedCount,
              "bookmark",
              "#4ecdc4"
            )}
            {renderStatCard(
              "Categories",
              stats.categoriesRead,
              "grid",
              "#45b7d1"
            )}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <TouchableOpacity onPress={() => setShowSettings(!showSettings)}>
              <Ionicons name="settings" size={24} color="#667eea" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.actionItem}>
            <Ionicons name="person" size={24} color="#667eea" />
            <Text style={styles.actionText}>Edit Profile</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem}>
            <Ionicons name="bookmark" size={24} color="#667eea" />
            <Text style={styles.actionText}>Saved Articles</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem}>
            <Ionicons name="time" size={24} color="#667eea" />
            <Text style={styles.actionText}>Reading History</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem}>
            <Ionicons name="notifications" size={24} color="#667eea" />
            <Text style={styles.actionText}>Notifications</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        {showSettings && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>App Settings</Text>

            <View style={styles.settingsGroup}>
              <Text style={styles.groupTitle}>Reading Mode</Text>
              {renderSettingItem(
                "Dark Mode",
                "Switch between light and dark themes",
                settings.readingMode.darkMode,
                (value) =>
                  updateNestedSetting("readingMode", "darkMode", value),
                "moon"
              )}
              {renderSettingItem(
                "Auto Scroll",
                "Automatically scroll through articles",
                settings.readingMode.autoScroll,
                (value) =>
                  updateNestedSetting("readingMode", "autoScroll", value),
                "play"
              )}
            </View>

            <View style={styles.settingsGroup}>
              <Text style={styles.groupTitle}>Audio Settings</Text>
              {renderSettingItem(
                "Audio Mode",
                "Enable text-to-speech for articles",
                settings.audioSettings.enabled,
                (value) =>
                  updateNestedSetting("audioSettings", "enabled", value),
                "volume-high"
              )}
            </View>

            <View style={styles.settingsGroup}>
              <Text style={styles.groupTitle}>Notifications</Text>
              {renderSettingItem(
                "Daily Digest",
                "Receive daily news summaries",
                settings.notifications.dailyDigest,
                (value) =>
                  updateNestedSetting("notifications", "dailyDigest", value),
                "mail"
              )}
              {renderSettingItem(
                "Breaking News",
                "Get alerts for breaking news",
                settings.notifications.breakingNews,
                (value) =>
                  updateNestedSetting("notifications", "breakingNews", value),
                "alert-circle"
              )}
              {renderSettingItem(
                "Personalized Alerts",
                "Notifications based on your interests",
                settings.notifications.personalizedAlerts,
                (value) =>
                  updateNestedSetting(
                    "notifications",
                    "personalizedAlerts",
                    value
                  ),
                "heart"
              )}
            </View>

            <View style={styles.settingsGroup}>
              <Text style={styles.groupTitle}>General</Text>
              {renderSettingItem(
                "Offline Mode",
                "Download articles for offline reading",
                settings.offlineMode,
                (value) => updateSetting("offlineMode", value),
                "download"
              )}
              {renderSettingItem(
                "Auto Refresh",
                "Automatically refresh news feed",
                settings.autoRefresh,
                (value) => updateSetting("autoRefresh", value),
                "refresh"
              )}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out" size={24} color="#fff" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  profileInfo: {
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 10,
  },
  creditsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  creditsText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 5,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    width: (width - 60) / 2,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  statText: {
    marginLeft: 10,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  statTitle: {
    fontSize: 12,
    color: "rgba(0,0,0,0.6)",
    marginTop: 2,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    marginLeft: 15,
  },
  settingsGroup: {
    marginBottom: 20,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  settingContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  settingText: {
    marginLeft: 15,
  },
  settingTitle: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  settingSubtitle: {
    fontSize: 14,
    color: "rgba(0,0,0,0.6)",
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff4757",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
});

export default ProfileScreen;
