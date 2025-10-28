import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { NewsArticle } from "../types";
import { MockDataService } from "../services/mockDataService";

const { width } = Dimensions.get("window");

interface SavedScreenProps {
  savedArticles: string[];
  onArticleSelect: (article: NewsArticle) => void;
  onRemoveSaved: (articleId: string) => void;
}

interface SavedArticleCardProps {
  article: NewsArticle;
  onSelect: (article: NewsArticle) => void;
  onRemove: (articleId: string) => void;
}

const SavedArticleCard: React.FC<SavedArticleCardProps> = ({
  article,
  onSelect,
  onRemove,
}) => {
  const { theme } = useTheme();

  const handleRemove = () => {
    Alert.alert(
      "Remove Article",
      "Are you sure you want to remove this article from your saved list?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => onRemove(article.id),
        },
      ]
    );
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
      style={[styles.card, { backgroundColor: theme.colors.surface }]}
      onPress={() => onSelect(article)}
      activeOpacity={0.9}
    >
      <View style={styles.cardContent}>
        {/* Article Image */}
        <View style={styles.imageContainer}>
          <View
            style={[
              styles.imagePlaceholder,
              { backgroundColor: theme.colors.primary },
            ]}
          >
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
            <Text style={[styles.source, { color: theme.colors.primary }]}>
              {article.source}
            </Text>
            <Text style={[styles.time, { color: theme.colors.textSecondary }]}>
              {formatTime(article.publishedAt)}
            </Text>
          </View>

          <Text
            style={[styles.title, { color: theme.colors.text }]}
            numberOfLines={3}
          >
            {article.title}
          </Text>

          <Text
            style={[styles.description, { color: theme.colors.textSecondary }]}
            numberOfLines={3}
          >
            {article.description}
          </Text>

          <View style={styles.footer}>
            <View style={styles.authorInfo}>
              <Text
                style={[styles.author, { color: theme.colors.textSecondary }]}
              >
                By {article.author}
              </Text>
              <Text
                style={[styles.readTime, { color: theme.colors.textSecondary }]}
              >
                {article.readTime} min read
              </Text>
            </View>
            <Text style={[styles.credits, { color: theme.colors.warning }]}>
              +{article.credits}
            </Text>
          </View>
        </View>

        {/* Remove Button */}
        <TouchableOpacity
          style={[
            styles.removeButton,
            { backgroundColor: theme.colors.error + "20" },
          ]}
          onPress={handleRemove}
        >
          <Ionicons name="trash-outline" size={18} color={theme.colors.error} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const SavedScreen: React.FC<SavedScreenProps> = ({
  savedArticles,
  onArticleSelect,
  onRemoveSaved,
}) => {
  const { theme } = useTheme();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"date" | "category" | "source">("date");

  useEffect(() => {
    loadSavedArticles();
  }, [savedArticles]);

  const loadSavedArticles = async () => {
    setIsLoading(true);
    try {
      const allArticles = MockDataService.getMockArticles();
      const savedArticlesData = allArticles.filter((article) =>
        savedArticles.includes(article.id)
      );
      setArticles(savedArticlesData);
    } catch (error) {
      console.error("Error loading saved articles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const sortArticles = (
    articles: NewsArticle[],
    sortBy: "date" | "category" | "source"
  ) => {
    return [...articles].sort((a, b) => {
      switch (sortBy) {
        case "date":
          return (
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime()
          );
        case "category":
          return a.category.localeCompare(b.category);
        case "source":
          return a.source.localeCompare(b.source);
        default:
          return 0;
      }
    });
  };

  const sortedArticles = sortArticles(articles, sortBy);

  const renderArticle = ({ item }: { item: NewsArticle }) => (
    <SavedArticleCard
      article={item}
      onSelect={onArticleSelect}
      onRemove={onRemoveSaved}
    />
  );

  const renderHeader = () => (
    <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
      <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
        Saved Articles
      </Text>
      <Text
        style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}
      >
        {articles.length} articles saved
      </Text>

      {/* Sort Options */}
      <View style={styles.sortContainer}>
        <Text style={[styles.sortLabel, { color: theme.colors.textSecondary }]}>
          Sort by:
        </Text>
        <View style={styles.sortButtons}>
          {[
            { key: "date", label: "Date" },
            { key: "category", label: "Category" },
            { key: "source", label: "Source" },
          ].map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.sortButton,
                sortBy === option.key && styles.activeSortButton,
                sortBy === option.key && {
                  backgroundColor: theme.colors.primary,
                },
              ]}
              onPress={() => setSortBy(option.key as any)}
            >
              <Text
                style={[
                  styles.sortButtonText,
                  {
                    color:
                      sortBy === option.key
                        ? "#fff"
                        : theme.colors.textSecondary,
                  },
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons
        name="bookmark-outline"
        size={64}
        color={theme.colors.textSecondary}
      />
      <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
        No Saved Articles
      </Text>
      <Text
        style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}
      >
        Save articles you want to read later by tapping the bookmark icon
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.loadingContainer}>
          <Text
            style={[styles.loadingText, { color: theme.colors.textSecondary }]}
          >
            Loading saved articles...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {articles.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={sortedArticles}
          renderItem={renderArticle}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  sortContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sortLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  sortButtons: {
    flexDirection: "row",
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginLeft: 8,
    backgroundColor: "#f0f0f0",
  },
  activeSortButton: {
    backgroundColor: "#667eea",
  },
  sortButtonText: {
    fontSize: 12,
    fontWeight: "500",
  },
  card: {
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
    marginRight: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  source: {
    fontSize: 12,
    fontWeight: "600",
  },
  time: {
    fontSize: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    lineHeight: 22,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
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
    marginRight: 10,
  },
  readTime: {
    fontSize: 12,
  },
  credits: {
    fontSize: 12,
    fontWeight: "600",
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
  },
});

export default SavedScreen;
