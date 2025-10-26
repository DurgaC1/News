import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView 
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { NewsPreferences } from '../types';
import { AuthService } from '../services/authService';

const categories = [
  { id: 'business', name: 'Business' },
  { id: 'entertainment', name: 'Entertainment' },
  { id: 'health', name: 'Health' },
  { id: 'science', name: 'Science' },
  { id: 'sports', name: 'Sports' },
  { id: 'technology', name: 'Technology' },
  { id: 'politics', name: 'Politics' },
  { id: 'world', name: 'World' },
];

const sources = [
  { id: 'bbc-news', name: 'BBC News' },
  { id: 'cnn', name: 'CNN' },
  { id: 'the-verge', name: 'The Verge' },
  { id: 'wired', name: 'Wired' },
  { id: 'time', name: 'TIME' },
  { id: 'reuters', name: 'Reuters' },
  { id: 'associated-press', name: 'Associated Press' },
  { id: 'techcrunch', name: 'TechCrunch' },
];

const languages = [
  { id: 'en', name: 'English' },
  { id: 'es', name: 'Spanish' },
  { id: 'fr', name: 'French' },
  { id: 'de', name: 'German' },
];

const countries = [
  { id: 'us', name: 'United States' },
  { id: 'gb', name: 'United Kingdom' },
  { id: 'ca', name: 'Canada' },
  { id: 'au', name: 'Australia' },
  { id: 'in', name: 'India' },
];

interface PreferencesScreenProps {
  navigation: any;
  route: {
    params?: {
      isFirstTime?: boolean;
    };
  };
}

const PreferencesScreen: React.FC<PreferencesScreenProps> = ({ navigation, route }) => {
  const { user, login } = useAuth();
  const isFirstTime = route.params?.isFirstTime || false;
  
  const [preferences, setPreferences] = useState<NewsPreferences>(
    user?.preferences || {
      categories: [],
      sources: [],
      languages: ['en'],
      countries: ['us'],
    }
  );

  const toggleCategory = (categoryId: string) => {
    setPreferences(prev => {
      const categories = prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId];
      
      return { ...prev, categories };
    });
  };

  const toggleSource = (sourceId: string) => {
    setPreferences(prev => {
      const sources = prev.sources.includes(sourceId)
        ? prev.sources.filter(id => id !== sourceId)
        : [...prev.sources, sourceId];
      
      return { ...prev, sources };
    });
  };

  const toggleLanguage = (languageId: string) => {
    setPreferences(prev => {
      const languages = prev.languages.includes(languageId)
        ? prev.languages.filter(id => id !== languageId)
        : [...prev.languages, languageId];
      
      return { ...prev, languages };
    });
  };

  const toggleCountry = (countryId: string) => {
    setPreferences(prev => {
      const countries = prev.countries.includes(countryId)
        ? prev.countries.filter(id => id !== countryId)
        : [...prev.countries, countryId];
      
      return { ...prev, countries };
    });
  };

  const handleSave = async () => {
    try {
      // Ensure at least one category is selected
      if (preferences.categories.length === 0) {
        // Add a default category if none selected
        setPreferences(prev => ({
          ...prev,
          categories: ['general'],
        }));
      }

      if (user) {
        // Update user preferences in backend
        const updatedUser = await AuthService.updatePreferences(preferences);
        if (updatedUser) {
          login(updatedUser);
        }
      }

      if (isFirstTime) {
        // Navigate to the main app if this is first-time setup
        navigation.replace('Main');
      } else {
        // Go back to previous screen
        navigation.goBack();
      }
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  };

  const renderSelectionItem = (
    item: { id: string; name: string },
    isSelected: boolean,
    onToggle: (id: string) => void
  ) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.selectionItem,
        isSelected && styles.selectedItem
      ]}
      onPress={() => onToggle(item.id)}
    >
      <Text style={[
        styles.selectionItemText,
        isSelected && styles.selectedItemText
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {isFirstTime ? 'Set Your Preferences' : 'Edit Preferences'}
        </Text>
        <Text style={styles.headerSubtitle}>
          Customize your news feed to see what matters to you
        </Text>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <Text style={styles.sectionSubtitle}>Select topics you're interested in</Text>
          <View style={styles.selectionGrid}>
            {categories.map(category => renderSelectionItem(
              category,
              preferences.categories.includes(category.id),
              toggleCategory
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sources</Text>
          <Text style={styles.sectionSubtitle}>Choose your preferred news sources</Text>
          <View style={styles.selectionGrid}>
            {sources.map(source => renderSelectionItem(
              source,
              preferences.sources.includes(source.id),
              toggleSource
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Languages</Text>
          <Text style={styles.sectionSubtitle}>Select languages for your news</Text>
          <View style={styles.selectionGrid}>
            {languages.map(language => renderSelectionItem(
              language,
              preferences.languages.includes(language.id),
              toggleLanguage
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Countries</Text>
          <Text style={styles.sectionSubtitle}>Choose regions you want news from</Text>
          <View style={styles.selectionGrid}>
            {countries.map(country => renderSelectionItem(
              country,
              preferences.countries.includes(country.id),
              toggleCountry
            ))}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>
              {isFirstTime ? 'Get Started' : 'Save Preferences'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    backgroundColor: '#4263eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 15,
  },
  selectionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  selectionItem: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    margin: 5,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedItem: {
    backgroundColor: '#4263eb',
    borderColor: '#4263eb',
  },
  selectionItemText: {
    color: '#333',
    fontSize: 14,
  },
  selectedItemText: {
    color: '#fff',
  },
  buttonContainer: {
    marginVertical: 30,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#4263eb',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#4263eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PreferencesScreen;