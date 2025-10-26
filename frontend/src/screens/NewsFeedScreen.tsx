import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  ViewToken,
} from 'react-native';
import { useNews } from '../contexts/NewsContext';
import { useAuth } from '../contexts/AuthContext';
import { useCredits } from '../contexts/CreditsContext';
import ArticleCard from '../components/ArticleCard';
import * as Speech from 'expo-speech';

const { width, height } = Dimensions.get('window');

interface NewsFeedScreenProps {
  navigation: any;
}

const NewsFeedScreen: React.FC<NewsFeedScreenProps> = ({ navigation }) => {
  const { articles, isLoading, error, refreshNews, saveArticle, addToHistory } = useNews();
  const { user, logout } = useAuth();
  const { addCredits } = useCredits();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'card' | 'newspaper'>('card');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    refreshNews();
    return () => {
      if (Speech.isSpeakingAsync()) {
        Speech.stop();
      }
    };
  }, [refreshNews]);

  const handleViewableItemsChanged = ({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index;
      if (index !== null && index !== undefined) {
        setCurrentIndex(index);
        if (articles[index]) {
          addToHistory(articles[index].id);
        }
      }
    }
  };

  const viewabilityConfig = { itemVisiblePercentThreshold: 50 };

  const handleSave = (articleId: string) => {
    saveArticle(articleId);
  };

  const handleReadAloud = (articleId: string) => {
    const article = articles.find(a => a.id === articleId);
    if (!article) return;

    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    } else {
      const textToRead = `${article.title}. ${article.content}`;
      Speech.speak(textToRead, {
        language: 'en',
        pitch: 1.0,
        rate: 0.9,
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
      });
      setIsSpeaking(true);
    }
  };

  const handleViewModeChange = () => {
    setViewMode(prev => (prev === 'card' ? 'newspaper' : 'card'));
  };

  const handleEarnCredits = (articleId: string) => {
    const article = articles.find(a => a.id === articleId);
    if (article) {
      addCredits(article.credits);
    }
  };

  const renderArticle = ({ item }: { item: any }) => {
    const isSaved = user?.savedArticles.includes(item.id) || false;
    return (
      <ArticleCard
        article={item}
        onSave={handleSave}
        onReadAloud={handleReadAloud}
        onViewModeChange={handleViewModeChange}
        isSaved={isSaved}
        viewMode={viewMode}
        earnCredits={handleEarnCredits}
      />
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4263eb" />
        <Text style={styles.loadingText}>Loading your personalized news feed...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Something went wrong</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refreshNews}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (articles.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No articles found</Text>
        <Text style={styles.emptyMessage}>Try adjusting your preferences or check back later</Text>
        <TouchableOpacity
          style={styles.preferencesButton}
          onPress={() => navigation.navigate('Preferences')}
        >
          <Text style={styles.preferencesButtonText}>Edit Preferences</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>NewsFlow</Text>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.credits}>Credits: {user?.credits || 0}</Text>
        </View>
      </View>
      <FlatList
        ref={flatListRef}
        data={articles}
        renderItem={renderArticle}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={height - 80}
        snapToAlignment="start"
        decelerationRate="fast"
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={handleViewableItemsChanged}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        windowSize={5}
        getItemLayout={(_, index) => ({
          length: height - 80,
          offset: (height - 80) * index,
          index,
        })}
        onRefresh={refreshNews}
        refreshing={isLoading}
      />
      <View style={styles.pagination}>
        {articles.map((_, index) => (
          <View
            key={index}
            style={[styles.paginationDot, currentIndex === index && styles.paginationDotActive]}
          />
        ))}
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#667eea',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  userInfo: {
    alignItems: 'flex-end',
  },
  userName: {
    color: '#fff',
    fontSize: 16,
  },
  credits: {
    color: '#fff',
    fontSize: 14,
    marginTop: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6c757d',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  errorText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#dc3545',
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#4263eb',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    pointerEvents: 'auto', // Explicitly set
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 10,
  },
  emptyMessage: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 20,
  },
  preferencesButton: {
    backgroundColor: '#4263eb',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    pointerEvents: 'auto', // Explicitly set
  },
  preferencesButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  pagination: {
    position: 'absolute',
    right: 20,
    top: '50%',
    transform: [{ translateY: -50 }],
    flexDirection: 'column',
    alignItems: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    marginVertical: 4,
  },
  paginationDotActive: {
    backgroundColor: '#4263eb',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  logoutButton: {
    backgroundColor: '#ff4757',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    pointerEvents: 'auto', // Explicitly set
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default NewsFeedScreen;