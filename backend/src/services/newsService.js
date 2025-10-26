const axios = require('axios');
const Article = require('../models/Article');

class NewsService {
  constructor() {
    this.apiKey = process.env.NEWS_API_KEY;
    this.baseURL = process.env.NEWS_API_BASE_URL || 'https://newsapi.org/v2';
  }

  async getTopHeadlines(preferences = {}) {
    try {
      const params = {
        country: preferences.countries?.[0] || 'us',
        language: preferences.languages?.[0] || 'en',
        pageSize: 20,
        apiKey: this.apiKey
      };

      if (preferences.categories && preferences.categories.length > 0) {
        params.category = preferences.categories[0].toLowerCase();
      }

      const response = await axios.get(`${this.baseURL}/top-headlines`, { params });
      
      if (response.data.status === 'ok') {
        return await this.processArticles(response.data.articles);
      } else {
        throw new Error(response.data.message || 'NewsAPI error');
      }
    } catch (error) {
      console.error('Error fetching top headlines:', error.message);
      throw error;
    }
  }

  async searchNews(query, preferences = {}) {
    try {
      const params = {
        q: query,
        language: preferences.languages?.[0] || 'en',
        pageSize: 20,
        sortBy: 'publishedAt',
        apiKey: this.apiKey
      };

      if (preferences.countries && preferences.countries.length > 0) {
        params.country = preferences.countries[0];
      }

      const response = await axios.get(`${this.baseURL}/everything`, { params });
      
      if (response.data.status === 'ok') {
        return await this.processArticles(response.data.articles);
      } else {
        throw new Error(response.data.message || 'NewsAPI search error');
      }
    } catch (error) {
      console.error('Error searching news:', error.message);
      throw error;
    }
  }

  async getArticlesByCategory(category) {
    try {
      const params = {
        category: category.toLowerCase(),
        country: 'us',
        pageSize: 20,
        apiKey: this.apiKey
      };

      const response = await axios.get(`${this.baseURL}/top-headlines`, { params });
      
      if (response.data.status === 'ok') {
        return await this.processArticles(response.data.articles);
      } else {
        throw new Error(response.data.message || 'NewsAPI category error');
      }
    } catch (error) {
      console.error('Error fetching articles by category:', error.message);
      throw error;
    }
  }

  async getArticlesBySource(source) {
    try {
      const params = {
        sources: source,
        pageSize: 20,
        apiKey: this.apiKey
      };

      const response = await axios.get(`${this.baseURL}/top-headlines`, { params });
      
      if (response.data.status === 'ok') {
        return await this.processArticles(response.data.articles);
      } else {
        throw new Error(response.data.message || 'NewsAPI source error');
      }
    } catch (error) {
      console.error('Error fetching articles by source:', error.message);
      throw error;
    }
  }

  async processArticles(apiArticles) {
    const processedArticles = [];

    for (const article of apiArticles) {
      try {
        // Check if article already exists
        let existingArticle = await Article.findOne({ externalId: article.url });
        
        if (!existingArticle) {
          // Create new article
          const articleData = this.transformNewsApiArticle(article);
          existingArticle = new Article(articleData);
          await existingArticle.save();
        }

        processedArticles.push(existingArticle);
      } catch (error) {
        console.error('Error processing article:', error.message);
        // Continue with other articles
      }
    }

    return processedArticles;
  }

  transformNewsApiArticle(apiArticle) {
    return {
      externalId: apiArticle.url || `article-${Date.now()}`,
      title: apiArticle.title || 'No title available',
      description: apiArticle.description || 'No description available',
      content: apiArticle.content || apiArticle.description || 'No content available',
      url: apiArticle.url || '',
      imageUrl: apiArticle.urlToImage || 'https://picsum.photos/400/600',
      publishedAt: new Date(apiArticle.publishedAt || Date.now()),
      source: {
        name: apiArticle.source?.name || 'Unknown Source',
        id: apiArticle.source?.id || ''
      },
      category: this.mapCategory(apiArticle.source?.name || ''),
      author: apiArticle.author || 'Unknown Author',
      readTime: this.calculateReadTime(apiArticle.content || apiArticle.description || ''),
      credits: this.calculateCredits(apiArticle.content || apiArticle.description || ''),
      language: 'en',
      country: 'us'
    };
  }

  mapCategory(sourceName) {
    const techSources = ['techcrunch', 'the-verge', 'wired', 'ars-technica'];
    const businessSources = ['bloomberg', 'reuters', 'cnbc', 'financial-times'];
    const sportsSources = ['espn', 'bbc-sport', 'the-sport-bible'];
    
    const lowerSource = sourceName.toLowerCase();
    
    if (techSources.some(source => lowerSource.includes(source))) {
      return 'Technology';
    } else if (businessSources.some(source => lowerSource.includes(source))) {
      return 'Business';
    } else if (sportsSources.some(source => lowerSource.includes(source))) {
      return 'Sports';
    }
    
    return 'General';
  }

  calculateReadTime(content) {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  }

  calculateCredits(content) {
    const wordCount = content.split(' ').length;
    return Math.max(5, Math.min(30, Math.ceil(wordCount / 50)));
  }
}

module.exports = new NewsService();
