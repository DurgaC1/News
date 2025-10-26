import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useNews } from '../contexts/NewsContext';
import { useCredits } from '../contexts/CreditsContext';

const HomeScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const { articles, currentIndex, nextArticle, previousArticle, isLoading } = useNews();
  const { credits } = useCredits();

  const currentArticle = articles[currentIndex];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>NewsFlow</Text>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.credits}>Credits: {credits}</Text>
        </View>
      </View>

      {isLoading ? (
        <Text style={styles.loading}>Loading news...</Text>
      ) : currentArticle ? (
        <View style={styles.articleContainer}>
          <Text style={styles.articleTitle}>{currentArticle.title}</Text>
          <Text style={styles.articleDescription}>{currentArticle.description}</Text>
          <Text style={styles.articleSource}>Source: {currentArticle.source}</Text>
          <Text style={styles.articleAuthor}>Author: {currentArticle.author}</Text>

          <View style={styles.navigationButtons}>
            <TouchableOpacity style={styles.navButton} onPress={previousArticle}>
              <Text style={styles.navButtonText}>Previous</Text>
            </TouchableOpacity>
            <Text style={styles.indexText}>
              {currentIndex + 1} / {articles.length}
            </Text>
            <TouchableOpacity style={styles.navButton} onPress={nextArticle}>
              <Text style={styles.navButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <Text style={styles.noNews}>No news articles available</Text>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  loading: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
  },
  articleContainer: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  articleTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  articleDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
    lineHeight: 24,
  },
  articleSource: {
    fontSize: 14,
    color: '#999',
    marginBottom: 5,
  },
  articleAuthor: {
    fontSize: 14,
    color: '#999',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  navButton: {
    backgroundColor: '#667eea',
    padding: 10,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  navButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  indexText: {
    fontSize: 16,
    color: '#666',
  },
  noNews: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
    color: '#999',
  },
  logoutButton: {
    backgroundColor: '#ff4757',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;

