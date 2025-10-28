import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { View, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider, useAuth } from "./src/contexts/AuthContext";
import { NewsProvider } from "./src/contexts/NewsContext";
import { CreditsProvider } from "./src/contexts/CreditsContext";
import { ThemeProvider } from "./src/contexts/ThemeContext";
import LoginScreen from "./src/screens/LoginScreen";
import PreferencesScreen from "./src/screens/PreferencesScreen";
import ReadingModeSelector from "./src/components/ReadingModeSelector";
import SearchScreen from "./src/screens/SearchScreen";
import SavedScreen from "./src/screens/SavedScreen";
import HistoryScreen from "./src/screens/HistoryScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import TabBar from "./src/components/TabBar";
import { NewsArticle, NewsPreferences, AppSettings } from "./src/types";
import { MockDataService } from "./src/services/mockDataService";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainTabNavigator = () => {
  const { user } = useAuth();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(
    null
  );

  useEffect(() => {
    loadPersonalizedFeed();
  }, [user?.preferences]);

  const loadPersonalizedFeed = async () => {
    try {
      const preferences = user?.preferences || {
        categories: [],
        sources: [],
        languages: ["en"],
        countries: ["us"],
      };
      const feed = MockDataService.getPersonalizedFeed(preferences);
      setArticles(feed);
    } catch (error) {
      console.error("Error loading feed:", error);
      // Fallback to mock articles
      setArticles(MockDataService.getMockArticles());
    }
  };

  const handleArticleChange = (article: NewsArticle, index: number) => {
    setCurrentIndex(index);
    // Add to reading history
    if (user) {
      // This would typically be handled by the backend
      console.log("Article viewed:", article.id);
    }
  };

  const handleLike = (articleId: string) => {
    console.log("Article liked:", articleId);
    // Implement like functionality
  };

  const handleSave = (articleId: string) => {
    console.log("Article saved:", articleId);
    // Implement save functionality
  };

  const handleShare = (articleId: string) => {
    console.log("Article shared:", articleId);
    // Implement share functionality
  };

  const handleReadAloud = (articleId: string) => {
    setIsSpeaking(!isSpeaking);
    console.log("Read aloud:", articleId);
    // Implement text-to-speech functionality
  };

  const handleArticleSelect = (article: NewsArticle) => {
    setSelectedArticle(article);
  };

  const HomeScreen = () => (
    <View style={styles.container}>
      <ReadingModeSelector
        articles={articles}
        currentIndex={currentIndex}
        onArticleChange={handleArticleChange}
        onLike={handleLike}
        onSave={handleSave}
        onShare={handleShare}
        onReadAloud={handleReadAloud}
        isSpeaking={isSpeaking}
      />
    </View>
  );

  const SearchScreenWrapper = () => (
    <SearchScreen onArticleSelect={handleArticleSelect} onBack={() => {}} />
  );

  const SavedScreenWrapper = () => (
    <SavedScreen
      savedArticles={user?.savedArticles || []}
      onArticleSelect={handleArticleSelect}
      onRemoveSaved={(articleId) => {
        console.log("Remove saved article:", articleId);
        // Implement remove saved article functionality
      }}
    />
  );

  const HistoryScreenWrapper = () => <HistoryScreen />;

  const ProfileScreenWrapper = () => (
    <ProfileScreen
      user={user!}
      onLogout={() => {}}
      onUpdatePreferences={() => {}}
      onUpdateSettings={() => {}}
    />
  );

  return (
    <Tab.Navigator
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreenWrapper} />
      <Tab.Screen name="Saved" component={SavedScreenWrapper} />
      <Tab.Screen name="History" component={HistoryScreenWrapper} />
      <Tab.Screen name="Profile" component={ProfileScreenWrapper} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { user, isLoading } = useAuth();
  const [showPreferences, setShowPreferences] = useState(false);

  useEffect(() => {
    // Check if user needs to set preferences
    if (
      user &&
      (!user.preferences || user.preferences.categories.length === 0)
    ) {
      setShowPreferences(true);
    }
  }, [user]);

  const handlePreferencesComplete = (preferences: NewsPreferences) => {
    setShowPreferences(false);
    // Update user preferences
    console.log("Preferences updated:", preferences);
  };

  if (isLoading) {
    return <View style={styles.loadingContainer} />;
  }

  if (!user) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Navigator>
    );
  }

  if (showPreferences) {
    return (
      <PreferencesScreen
        onComplete={handlePreferencesComplete}
        initialPreferences={user.preferences}
      />
    );
  }

  return <MainTabNavigator />;
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <ThemeProvider>
          <AuthProvider>
            <CreditsProvider>
              <NewsProvider>
                <AppNavigator />
                <StatusBar style="light" />
              </NewsProvider>
            </CreditsProvider>
          </AuthProvider>
        </ThemeProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#667eea",
  },
});
