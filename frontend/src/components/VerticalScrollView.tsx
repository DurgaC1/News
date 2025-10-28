import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { NewsArticle } from "../types";

const { width } = Dimensions.get("window");

interface VerticalScrollViewProps {
  articles: NewsArticle[];
  onArticleSelect: (article: NewsArticle) => void;
  onLike: (articleId: string) => void;
  onSave: (articleId: string) => void;
  onShare: (articleId: string) => void;
  onReadAloud: (articleId: string) => void;
  isSpeaking: boolean;
}

interface ArticleCardProps {
  article: NewsArticle;
  onSelect: (article: NewsArticle) => void;
  onLike: (articleId: string) => void;
  onSave: (articleId: string) => void;
  onShare: (articleId: string) => void;
  onReadAloud: (articleId: string) => void;
  isSpeaking: boolean;
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onSelect,
  onLike,
  onSave,
  onShare,
  onReadAloud,
  isSpeaking,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike(article.id);

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    onSave(article.id);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onSelect(article)}
      activeOpacity={0.9}
    >
      <View style={styles.cardContent}>
        {/* Article Image */}
        <View style={styles.imageContainer}>
          <View style={styles.imagePlaceholder}>
            <Text style={styles.categoryText}>{article.category}</Text>
          </View>
          {article.trendingScore && article.trendingScore > 80 && (
            <View style={styles.trendingBadge}>
              <Ionicons name="trending-up" size={12} color="#fff" />
              <Text style={styles.trendingText}>Trending</Text>
            </View>
          )}
        </View>

        {/* Article Content */}
        <View style={styles.textContent}>
          <View style={styles.header}>
            <Text style={styles.source}>{article.source}</Text>
            <Text style={styles.time}>{formatTime(article.publishedAt)}</Text>
          </View>

          <Text style={styles.title} numberOfLines={3}>
            {article.title}
          </Text>

          <Text style={styles.description} numberOfLines={3}>
            {article.description}
          </Text>

          <View style={styles.footer}>
            <View style={styles.authorInfo}>
              <Text style={styles.author}>By {article.author}</Text>
              <Text style={styles.readTime}>{article.readTime} min read</Text>
            </View>
            <Text style={styles.credits}>+{article.credits}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <Ionicons
                name={isLiked ? "heart" : "heart-outline"}
                size={18}
                color={isLiked ? "#ff4757" : "#666"}
              />
            </Animated.View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleSave}>
            <Ionicons
              name={isSaved ? "bookmark" : "bookmark-outline"}
              size={18}
              color={isSaved ? "#ffa502" : "#666"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onShare(article.id)}
          >
            <Ionicons name="share-outline" size={18} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onReadAloud(article.id)}
          >
            <Ionicons
              name={isSpeaking ? "pause-circle" : "play-circle-outline"}
              size={18}
              color="#666"
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const VerticalScrollView: React.FC<VerticalScrollViewProps> = ({
  articles,
  onArticleSelect,
  onLike,
  onSave,
  onShare,
  onReadAloud,
  isSpeaking,
}) => {
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const renderArticle = ({ item }: { item: NewsArticle }) => (
    <ArticleCard
      article={item}
      onSelect={onArticleSelect}
      onLike={onLike}
      onSave={onSave}
      onShare={onShare}
      onReadAloud={onReadAloud}
      isSpeaking={isSpeaking}
    />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Latest News</Text>
      <Text style={styles.headerSubtitle}>
        Stay informed with the latest updates
      </Text>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footer}>
      <Text style={styles.footerText}>You've reached the end</Text>
      <TouchableOpacity style={styles.loadMoreButton}>
        <Text style={styles.loadMoreText}>Load More</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <FlatList
        data={articles}
        renderItem={renderArticle}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        contentContainerStyle={styles.listContainer}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  listContainer: {
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#666",
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flexDirection: "row",
    padding: 15,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
    position: "relative",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#667eea",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
    textAlign: "center",
  },
  trendingBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#ff4757",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  trendingText: {
    color: "#fff",
    fontSize: 8,
    fontWeight: "600",
    marginLeft: 2,
  },
  textContent: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  source: {
    fontSize: 12,
    color: "#667eea",
    fontWeight: "600",
  },
  time: {
    fontSize: 12,
    color: "#999",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    lineHeight: 22,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  authorInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  author: {
    fontSize: 12,
    color: "#999",
    marginRight: 10,
  },
  readTime: {
    fontSize: 12,
    color: "#999",
  },
  credits: {
    fontSize: 12,
    color: "#ffa502",
    fontWeight: "600",
  },
  actionButtons: {
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    paddingLeft: 10,
  },
  actionButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#f8f9fa",
    marginVertical: 2,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: "center",
  },
  footerText: {
    fontSize: 16,
    color: "#999",
    marginBottom: 15,
  },
  loadMoreButton: {
    backgroundColor: "#667eea",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  loadMoreText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default VerticalScrollView;
