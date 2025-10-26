import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  Share,
} from 'react-native';
import { NewsArticle } from '../types';

const { width, height } = Dimensions.get('window');

interface ArticleCardProps {
  article: NewsArticle;
  onSave: (articleId: string) => void;
  onReadAloud: (articleId: string) => void;
  onViewModeChange: () => void;
  isSaved: boolean;
  viewMode: 'card' | 'newspaper';
  earnCredits: (articleId: string) => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onSave,
  onReadAloud,
  onViewModeChange,
  isSaved,
  viewMode,
  earnCredits,
}) => {
  const [isReading, setIsReading] = useState(false);
  const [hasEarnedCredits, setHasEarnedCredits] = useState(false);
  const [readingProgress] = useState(new Animated.Value(0));

  const handleReadAloud = () => {
    setIsReading(!isReading);
    onReadAloud(article.id);
  };

  const handleSave = () => {
    onSave(article.id);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this article: ${article.title} - ${article.url}`,
        url: article.url,
      });
    } catch (error) {
      console.error('Error sharing article:', error);
    }
  };

  const handleEarnCredits = () => {
    if (!hasEarnedCredits) {
      earnCredits(article.id);
      setHasEarnedCredits(true);
      
      // Animate reading progress
      Animated.timing(readingProgress, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const renderCardView = () => (
    <View style={styles.cardContainer}>
      <Image
        source={{ uri: article.imageUrl || 'https://via.placeholder.com/400x300' }}
        style={styles.image}
        resizeMode="cover"
      />
      
      <View style={styles.contentContainer}>
        <View style={styles.sourceContainer}>
          <Text style={styles.source}>{article.source}</Text>
          <Text style={styles.date}>{formatDate(article.publishedAt)}</Text>
        </View>
        
        <Text style={styles.title}>{article.title}</Text>
        <Text style={styles.description} numberOfLines={3}>{article.description}</Text>
        
        <View style={styles.metaContainer}>
          <Text style={styles.readTime}>{article.readTime} min read</Text>
          <Text style={styles.credits}>+{article.credits} credits</Text>
        </View>
        
        <View style={styles.progressContainer}>
          <Animated.View 
            style={[
              styles.progressBar, 
              { width: readingProgress.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }) }
            ]} 
          />
        </View>
      </View>
      
      <View style={styles.actionBar}>
        <TouchableOpacity style={styles.actionButton} onPress={handleReadAloud}>
          <Text style={styles.actionIcon}>{isReading ? '🔇' : '🔊'}</Text>
          <Text style={styles.actionText}>{isReading ? 'Stop' : 'Read Aloud'}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={handleSave}>
          <Text style={styles.actionIcon}>{isSaved ? '★' : '☆'}</Text>
          <Text style={styles.actionText}>{isSaved ? 'Saved' : 'Save'}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={onViewModeChange}>
          <Text style={styles.actionIcon}>📰</Text>
          <Text style={styles.actionText}>View Mode</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <Text style={styles.actionIcon}>↗️</Text>
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
      
      {!hasEarnedCredits && (
        <TouchableOpacity 
          style={styles.earnButton} 
          onPress={handleEarnCredits}
        >
          <Text style={styles.earnButtonText}>
            Read to earn {article.credits} credits
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderNewspaperView = () => (
    <View style={styles.newspaperContainer}>
      <View style={styles.newspaperHeader}>
        <Text style={styles.newspaperSource}>{article.source}</Text>
        <Text style={styles.newspaperDate}>{formatDate(article.publishedAt)}</Text>
      </View>
      
      <Text style={styles.newspaperTitle}>{article.title}</Text>
      <Text style={styles.newspaperAuthor}>By {article.author || 'Unknown'}</Text>
      
      <Image
        source={{ uri: article.imageUrl || 'https://via.placeholder.com/400x300' }}
        style={styles.newspaperImage}
        resizeMode="cover"
      />
      
      <Text style={styles.newspaperContent}>{article.content}</Text>
      
      <View style={styles.actionBar}>
        <TouchableOpacity style={styles.actionButton} onPress={handleReadAloud}>
          <Text style={styles.actionIcon}>{isReading ? '🔇' : '🔊'}</Text>
          <Text style={styles.actionText}>{isReading ? 'Stop' : 'Read Aloud'}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={handleSave}>
          <Text style={styles.actionIcon}>{isSaved ? '★' : '☆'}</Text>
          <Text style={styles.actionText}>{isSaved ? 'Saved' : 'Save'}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={onViewModeChange}>
          <Text style={styles.actionIcon}>🃏</Text>
          <Text style={styles.actionText}>Card View</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <Text style={styles.actionIcon}>↗️</Text>
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return viewMode === 'card' ? renderCardView() : renderNewspaperView();
};

const styles = StyleSheet.create({
  cardContainer: {
    width: width,
    height: height - 80, // Account for bottom tab bar and status bar
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '50%',
  },
  contentContainer: {
    padding: 20,
    flex: 1,
  },
  sourceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  source: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4263eb',
  },
  date: {
    fontSize: 14,
    color: '#6c757d',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1a1a2e',
  },
  description: {
    fontSize: 16,
    color: '#495057',
    lineHeight: 24,
    flex: 1,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  readTime: {
    fontSize: 14,
    color: '#6c757d',
  },
  credits: {
    fontSize: 14,
    fontWeight: '600',
    color: '#38b000',
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#e9ecef',
    borderRadius: 2,
    marginTop: 10,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4263eb',
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  actionButton: {
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 20,
    marginBottom: 5,
  },
  actionText: {
    fontSize: 12,
    color: '#495057',
  },
  earnButton: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
    backgroundColor: '#4263eb',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  earnButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  
  // Newspaper view styles
  newspaperContainer: {
    width: width,
    height: height - 80,
    backgroundColor: '#f8f9fa',
    padding: 20,
    overflow: 'scroll',
  },
  newspaperHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  newspaperSource: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
  },
  newspaperDate: {
    fontSize: 16,
    color: '#6c757d',
  },
  newspaperTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1a1a2e',
    lineHeight: 34,
  },
  newspaperAuthor: {
    fontSize: 16,
    color: '#495057',
    marginBottom: 15,
    fontStyle: 'italic',
  },
  newspaperImage: {
    width: '100%',
    height: 200,
    marginBottom: 15,
    borderRadius: 8,
  },
  newspaperContent: {
    fontSize: 18,
    lineHeight: 28,
    color: '#212529',
    marginBottom: 20,
  },
});

export default ArticleCard;