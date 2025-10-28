import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanGestureHandler,
  State,
  FlatList,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { NewsArticle } from "../types";
import { MockDataService } from "../services/mockDataService";

const { width, height } = Dimensions.get("window");

interface TikTokNewsFeedProps {
  articles: NewsArticle[];
  onArticleChange: (article: NewsArticle, index: number) => void;
  onLike: (articleId: string) => void;
  onSave: (articleId: string) => void;
  onShare: (articleId: string) => void;
  onReadAloud: (articleId: string) => void;
  currentIndex: number;
  isSpeaking: boolean;
}

interface NewsCardProps {
  article: NewsArticle;
  index: number;
  onLike: (articleId: string) => void;
  onSave: (articleId: string) => void;
  onShare: (articleId: string) => void;
  onReadAloud: (articleId: string) => void;
  isSpeaking: boolean;
}

const NewsCard: React.FC<NewsCardProps> = ({
  article,
  index,
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
        toValue: 1.2,
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
    <View style={styles.card}>
      <Image
        source={{ uri: article.imageUrl }}
        style={styles.backgroundImage}
      />
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.8)"]}
        style={styles.gradient}
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.sourceContainer}>
            <Text style={styles.source}>{article.source}</Text>
            <Text style={styles.time}>{formatTime(article.publishedAt)}</Text>
          </View>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{article.category}</Text>
          </View>
        </View>

        <View style={styles.textContent}>
          <Text style={styles.title} numberOfLines={3}>
            {article.title}
          </Text>
          <Text style={styles.description} numberOfLines={4}>
            {article.description}
          </Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.authorInfo}>
            <Text style={styles.author}>By {article.author}</Text>
            <Text style={styles.readTime}>{article.readTime} min read</Text>
          </View>
          <Text style={styles.credits}>+{article.credits} credits</Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={28}
              color={isLiked ? "#ff4757" : "#fff"}
            />
          </Animated.View>
          <Text style={styles.actionText}>Like</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleSave}>
          <Ionicons
            name={isSaved ? "bookmark" : "bookmark-outline"}
            size={28}
            color={isSaved ? "#ffa502" : "#fff"}
          />
          <Text style={styles.actionText}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onShare(article.id)}
        >
          <Ionicons name="share-outline" size={28} color="#fff" />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onReadAloud(article.id)}
        >
          <Ionicons
            name={isSpeaking ? "pause-circle" : "play-circle-outline"}
            size={28}
            color="#fff"
          />
          <Text style={styles.actionText}>
            {isSpeaking ? "Pause" : "Listen"}
          </Text>
        </TouchableOpacity>
      </View>

      {article.trendingScore && article.trendingScore > 80 && (
        <View style={styles.trendingBadge}>
          <Ionicons name="trending-up" size={16} color="#fff" />
          <Text style={styles.trendingText}>Trending</Text>
        </View>
      )}
    </View>
  );
};

const TikTokNewsFeed: React.FC<TikTokNewsFeedProps> = ({
  articles,
  onArticleChange,
  onLike,
  onSave,
  onShare,
  onReadAloud,
  currentIndex,
  isSpeaking,
}) => {
  const flatListRef = useRef<FlatList>(null);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    if (flatListRef.current && !isScrolling) {
      flatListRef.current.scrollToIndex({
        index: currentIndex,
        animated: true,
      });
    }
  }, [currentIndex, isScrolling]);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: any) => {
      if (viewableItems.length > 0) {
        const index = viewableItems[0].index;
        if (index !== null && index !== undefined && index !== currentIndex) {
          onArticleChange(articles[index], index);
        }
      }
    },
    [articles, currentIndex, onArticleChange]
  );

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: NewsArticle;
    index: number;
  }) => (
    <NewsCard
      article={item}
      index={index}
      onLike={onLike}
      onSave={onSave}
      onShare={onShare}
      onReadAloud={onReadAloud}
      isSpeaking={isSpeaking && index === currentIndex}
    />
  );

  const getItemLayout = (_: any, index: number) => ({
    length: height,
    offset: height * index,
    index,
  });

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <FlatList
        ref={flatListRef}
        data={articles}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={getItemLayout}
        onScrollBeginDrag={() => setIsScrolling(true)}
        onScrollEndDrag={() => setIsScrolling(false)}
        onMomentumScrollEnd={() => setIsScrolling(false)}
        snapToInterval={height}
        snapToAlignment="start"
        decelerationRate="fast"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  card: {
    width,
    height,
    position: "relative",
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "60%",
  },
  content: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sourceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  source: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginRight: 10,
  },
  time: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
  },
  categoryBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  textContent: {
    marginBottom: 20,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    lineHeight: 32,
    marginBottom: 10,
  },
  description: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 16,
    lineHeight: 24,
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
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    marginRight: 10,
  },
  readTime: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
  },
  credits: {
    color: "#ffa502",
    fontSize: 14,
    fontWeight: "600",
  },
  actionButtons: {
    position: "absolute",
    right: 20,
    bottom: 100,
    alignItems: "center",
  },
  actionButton: {
    alignItems: "center",
    marginBottom: 20,
  },
  actionText: {
    color: "#fff",
    fontSize: 12,
    marginTop: 5,
    fontWeight: "500",
  },
  trendingBadge: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "rgba(255,71,87,0.9)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trendingText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
});

export default TikTokNewsFeed;
