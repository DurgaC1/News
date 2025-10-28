import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { NewsArticle } from "../types";

const { width, height } = Dimensions.get("window");

interface NewspaperViewProps {
  articles: NewsArticle[];
  currentIndex: number;
  onArticleChange: (index: number) => void;
  onLike: (articleId: string) => void;
  onSave: (articleId: string) => void;
  onShare: (articleId: string) => void;
  onReadAloud: (articleId: string) => void;
  isSpeaking: boolean;
}

const NewspaperView: React.FC<NewspaperViewProps> = ({
  articles,
  currentIndex,
  onArticleChange,
  onLike,
  onSave,
  onShare,
  onReadAloud,
  isSpeaking,
}) => {
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">(
    "medium"
  );
  const [isDarkMode, setIsDarkMode] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const currentArticle = articles[currentIndex];

  const getFontSize = () => {
    switch (fontSize) {
      case "small":
        return 14;
      case "medium":
        return 16;
      case "large":
        return 18;
      default:
        return 16;
    }
  };

  const getTitleFontSize = () => {
    switch (fontSize) {
      case "small":
        return 20;
      case "medium":
        return 24;
      case "large":
        return 28;
      default:
        return 24;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const theme = {
    background: isDarkMode ? "#1a1a1a" : "#ffffff",
    text: isDarkMode ? "#ffffff" : "#333333",
    secondaryText: isDarkMode ? "#cccccc" : "#666666",
    border: isDarkMode ? "#333333" : "#e0e0e0",
    accent: "#667eea",
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: theme.background, opacity: fadeAnim },
      ]}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.newspaperHeader}>
            <Text style={[styles.newspaperTitle, { color: theme.accent }]}>
              NEWSFLOW
            </Text>
            <Text style={[styles.date, { color: theme.secondaryText }]}>
              {currentArticle ? formatDate(currentArticle.publishedAt) : ""}
            </Text>
          </View>

          <View style={styles.controls}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => setIsDarkMode(!isDarkMode)}
            >
              <Ionicons
                name={isDarkMode ? "sunny" : "moon"}
                size={20}
                color={theme.text}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => {
                const sizes: ("small" | "medium" | "large")[] = [
                  "small",
                  "medium",
                  "large",
                ];
                const currentIndex = sizes.indexOf(fontSize);
                const nextIndex = (currentIndex + 1) % sizes.length;
                setFontSize(sizes[nextIndex]);
              }}
            >
              <Ionicons name="text" size={20} color={theme.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Article Content */}
        {currentArticle && (
          <View style={styles.articleContainer}>
            {/* Article Header */}
            <View style={styles.articleHeader}>
              <Text style={[styles.category, { color: theme.accent }]}>
                {currentArticle.category.toUpperCase()}
              </Text>
              <Text style={[styles.timestamp, { color: theme.secondaryText }]}>
                {formatTime(currentArticle.publishedAt)}
              </Text>
            </View>

            {/* Article Title */}
            <Text
              style={[
                styles.articleTitle,
                { color: theme.text, fontSize: getTitleFontSize() },
              ]}
            >
              {currentArticle.title}
            </Text>

            {/* Article Meta */}
            <View style={styles.articleMeta}>
              <Text style={[styles.author, { color: theme.secondaryText }]}>
                By {currentArticle.author}
              </Text>
              <Text style={[styles.source, { color: theme.accent }]}>
                {currentArticle.source}
              </Text>
            </View>

            {/* Article Description */}
            <Text
              style={[
                styles.articleDescription,
                { color: theme.text, fontSize: getFontSize() },
              ]}
            >
              {currentArticle.description}
            </Text>

            {/* Article Content */}
            <Text
              style={[
                styles.articleContent,
                { color: theme.text, fontSize: getFontSize() },
              ]}
            >
              {currentArticle.content}
            </Text>

            {/* Article Footer */}
            <View style={styles.articleFooter}>
              <View style={styles.readingInfo}>
                <Text style={[styles.readTime, { color: theme.secondaryText }]}>
                  {currentArticle.readTime} min read
                </Text>
                <Text style={[styles.credits, { color: theme.accent }]}>
                  +{currentArticle.credits} credits
                </Text>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => onLike(currentArticle.id)}
                >
                  <Ionicons name="heart-outline" size={20} color={theme.text} />
                  <Text style={[styles.actionText, { color: theme.text }]}>
                    Like
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => onSave(currentArticle.id)}
                >
                  <Ionicons
                    name="bookmark-outline"
                    size={20}
                    color={theme.text}
                  />
                  <Text style={[styles.actionText, { color: theme.text }]}>
                    Save
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => onShare(currentArticle.id)}
                >
                  <Ionicons name="share-outline" size={20} color={theme.text} />
                  <Text style={[styles.actionText, { color: theme.text }]}>
                    Share
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => onReadAloud(currentArticle.id)}
                >
                  <Ionicons
                    name={isSpeaking ? "pause-circle" : "play-circle-outline"}
                    size={20}
                    color={theme.text}
                  />
                  <Text style={[styles.actionText, { color: theme.text }]}>
                    {isSpeaking ? "Pause" : "Listen"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Navigation */}
        <View style={styles.navigation}>
          <TouchableOpacity
            style={[
              styles.navButton,
              currentIndex === 0 && styles.disabledButton,
            ]}
            onPress={() =>
              currentIndex > 0 && onArticleChange(currentIndex - 1)
            }
            disabled={currentIndex === 0}
          >
            <Ionicons name="chevron-back" size={24} color={theme.text} />
            <Text style={[styles.navText, { color: theme.text }]}>
              Previous
            </Text>
          </TouchableOpacity>

          <Text style={[styles.pageIndicator, { color: theme.secondaryText }]}>
            {currentIndex + 1} of {articles.length}
          </Text>

          <TouchableOpacity
            style={[
              styles.navButton,
              currentIndex === articles.length - 1 && styles.disabledButton,
            ]}
            onPress={() =>
              currentIndex < articles.length - 1 &&
              onArticleChange(currentIndex + 1)
            }
            disabled={currentIndex === articles.length - 1}
          >
            <Text style={[styles.navText, { color: theme.text }]}>Next</Text>
            <Ionicons name="chevron-forward" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  newspaperHeader: {
    flex: 1,
  },
  newspaperTitle: {
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  date: {
    fontSize: 14,
    marginTop: 4,
  },
  controls: {
    flexDirection: "row",
  },
  controlButton: {
    padding: 10,
    marginLeft: 10,
    borderRadius: 8,
    backgroundColor: "rgba(102, 126, 234, 0.1)",
  },
  articleContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  articleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  category: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
  },
  timestamp: {
    fontSize: 12,
  },
  articleTitle: {
    fontWeight: "bold",
    lineHeight: 32,
    marginBottom: 15,
  },
  articleMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  author: {
    fontSize: 14,
    fontStyle: "italic",
  },
  source: {
    fontSize: 14,
    fontWeight: "600",
  },
  articleDescription: {
    lineHeight: 24,
    marginBottom: 20,
    fontStyle: "italic",
  },
  articleContent: {
    lineHeight: 26,
    marginBottom: 30,
  },
  articleFooter: {
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 20,
  },
  readingInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  readTime: {
    fontSize: 14,
  },
  credits: {
    fontSize: 14,
    fontWeight: "600",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  actionButton: {
    alignItems: "center",
    padding: 10,
  },
  actionText: {
    fontSize: 12,
    marginTop: 5,
  },
  navigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "rgba(102, 126, 234, 0.1)",
  },
  disabledButton: {
    opacity: 0.3,
  },
  navText: {
    fontSize: 14,
    fontWeight: "500",
    marginHorizontal: 5,
  },
  pageIndicator: {
    fontSize: 14,
    fontWeight: "500",
  },
});

export default NewspaperView;
