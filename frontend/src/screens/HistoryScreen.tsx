import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { NewsArticle } from '../types';
import { NewsService } from '../services/NewsService';

interface HistoryScreenProps {
  navigation: any;
}

const HistoryScreen: React.FC<HistoryScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const [articles, setArticles] = React.useState<NewsArticle[]>([]);

  React.useEffect(() => {
    const fetchHistoryArticles = async () => {
      try {
        const historyArticles = await Promise.all(
          user?.readingHistory.map(async (entry) => {
            const article = await NewsService.getArticleById(entry.articleId);
            return article;
          }) || []
        );
        setArticles(historyArticles.filter((article): article is NewsArticle => article !== null));
      } catch (error) {
        console.error('Error fetching history:', error);
      }
    };
    fetchHistoryArticles();
  }, [user?.readingHistory]);

  const renderItem = ({ item }: { item: NewsArticle }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('ArticleDetail', { article: item })}
    >
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.source}>{item.source}</Text>
      <Text style={styles.date}>
        Read on: {new Date(item.publishedAt).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Reading History</Text>
      <FlatList
        data={articles}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.empty}>No reading history</Text>}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  item: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 12 },
  title: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  source: { fontSize: 12, color: '#4263eb', marginBottom: 4 },
  date: { fontSize: 12, color: '#6c757d' },
  empty: { fontSize: 16, textAlign: 'center', marginTop: 20 },
});

export default HistoryScreen;