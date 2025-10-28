import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { NewsArticle } from "../types";
import { MockDataService } from "../services/mockDataService";

const { width } = Dimensions.get("window");

interface SearchScreenProps {
  onArticleSelect: (article: NewsArticle) => void;
  onBack: () => void;
}

interface TrendingTopic {
  id: string;
  title: string;
  count: number;
  category: string;
}

const SearchScreen: React.FC<SearchScreenProps> = ({
  onArticleSelect,
  onBack,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<NewsArticle[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const searchInputRef = useRef<TextInput>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const trendingTopics: TrendingTopic[] = [
    { id: "1", title: "AI Technology", count: 1250, category: "Technology" },
    { id: "2", title: "Climate Change", count: 980, category: "Environment" },
    { id: "3", title: "Space Exploration", count: 750, category: "Science" },
    { id: "4", title: "Electric Vehicles", count: 650, category: "Business" },
    { id: "5", title: "Health Breakthrough", count: 580, category: "Health" },
    { id: "6", title: "Sports Championship", count: 520, category: "Sports" },
  ];

  const categories = MockDataService.getCategories();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (searchQuery.length > 2) {
      performSearch(searchQuery);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const performSearch = async (query: string) => {
    setIsSearching(true);
    try {
      const results = MockDataService.searchArticles(query);
      setSearchResults(results);

      // Add to recent searches
      if (!recentSearches.includes(query)) {
        setRecentSearches((prev) => [query, ...prev.slice(0, 4)]);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleTrendingTopicPress = (topic: TrendingTopic) => {
    setSearchQuery(topic.title);
    setSelectedCategory(topic.category);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category);
    if (searchQuery) {
      performSearch(searchQuery);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setSelectedCategory(null);
    searchInputRef.current?.focus();
  };

  const renderTrendingTopic = ({ item }: { item: TrendingTopic }) => (
    <TouchableOpacity
      style={styles.trendingItem}
      onPress={() => handleTrendingTopicPress(item)}
    >
      <View style={styles.trendingContent}>
        <Text style={styles.trendingTitle}>{item.title}</Text>
        <Text style={styles.trendingCount}>{item.count} articles</Text>
      </View>
      <Ionicons name="trending-up" size={20} color="#667eea" />
    </TouchableOpacity>
  );

  const renderSearchResult = ({ item }: { item: NewsArticle }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => onArticleSelect(item)}
    >
      <View style={styles.resultContent}>
        <Text style={styles.resultTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.resultDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.resultMeta}>
          <Text style={styles.resultSource}>{item.source}</Text>
          <Text style={styles.resultTime}>
            {new Date(item.publishedAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
      <View style={styles.resultImage}>
        <Text style={styles.resultCategory}>{item.category}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryFilter = (category: string) => {
    const isSelected = selectedCategory === category;
    return (
      <TouchableOpacity
        key={category}
        style={[
          styles.categoryFilter,
          isSelected && styles.selectedCategoryFilter,
        ]}
        onPress={() => handleCategoryFilter(category)}
      >
        <Text
          style={[
            styles.categoryFilterText,
            isSelected && styles.selectedCategoryFilterText,
          ]}
        >
          {category}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.header}>
        <View style={styles.searchHeader}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color="rgba(255,255,255,0.6)" />
            <TextInput
              ref={searchInputRef}
              style={styles.searchInput}
              placeholder="Search news..."
              placeholderTextColor="rgba(255,255,255,0.6)"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={clearSearch}>
                <Ionicons
                  name="close-circle"
                  size={20}
                  color="rgba(255,255,255,0.6)"
                />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Ionicons name="filter" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {showFilters && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filtersContainer}
          >
            {categories.map(renderCategoryFilter)}
          </ScrollView>
        )}
      </LinearGradient>

      <View style={styles.content}>
        {searchQuery.length === 0 ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Trending Topics</Text>
              <FlatList
                data={trendingTopics}
                renderItem={renderTrendingTopic}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            </View>

            {recentSearches.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recent Searches</Text>
                {recentSearches.map((search, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.recentSearchItem}
                    onPress={() => setSearchQuery(search)}
                  >
                    <Ionicons name="time" size={20} color="rgba(0,0,0,0.6)" />
                    <Text style={styles.recentSearchText}>{search}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        setRecentSearches((prev) =>
                          prev.filter((_, i) => i !== index)
                        );
                      }}
                    >
                      <Ionicons
                        name="close"
                        size={20}
                        color="rgba(0,0,0,0.4)"
                      />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ScrollView>
        ) : (
          <View style={styles.resultsContainer}>
            {isSearching ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Searching...</Text>
              </View>
            ) : searchResults.length > 0 ? (
              <FlatList
                data={searchResults}
                renderItem={renderSearchResult}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <View style={styles.noResultsContainer}>
                <Ionicons name="search" size={48} color="rgba(0,0,0,0.3)" />
                <Text style={styles.noResultsText}>No results found</Text>
                <Text style={styles.noResultsSubtext}>
                  Try searching with different keywords
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  searchHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  backButton: {
    marginRight: 15,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
  },
  filterButton: {
    marginLeft: 15,
  },
  filtersContainer: {
    marginTop: 10,
  },
  categoryFilter: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  selectedCategoryFilter: {
    backgroundColor: "#fff",
  },
  categoryFilterText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    fontWeight: "500",
  },
  selectedCategoryFilterText: {
    color: "#667eea",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  trendingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  trendingContent: {
    flex: 1,
  },
  trendingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  trendingCount: {
    fontSize: 14,
    color: "rgba(0,0,0,0.6)",
  },
  recentSearchItem: {
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
  recentSearchText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    marginLeft: 10,
  },
  resultsContainer: {
    flex: 1,
    paddingTop: 20,
  },
  resultItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultContent: {
    flex: 1,
    marginRight: 10,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  resultDescription: {
    fontSize: 14,
    color: "rgba(0,0,0,0.7)",
    marginBottom: 8,
  },
  resultMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  resultSource: {
    fontSize: 12,
    color: "#667eea",
    fontWeight: "500",
  },
  resultTime: {
    fontSize: 12,
    color: "rgba(0,0,0,0.5)",
  },
  resultImage: {
    width: 60,
    height: 60,
    backgroundColor: "#667eea",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  resultCategory: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "rgba(0,0,0,0.6)",
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: "600",
    color: "rgba(0,0,0,0.6)",
    marginTop: 15,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: "rgba(0,0,0,0.4)",
    marginTop: 5,
  },
});

export default SearchScreen;
