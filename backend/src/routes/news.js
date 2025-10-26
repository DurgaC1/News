const express = require('express');
const newsService = require('../services/newsService');
const auth = require('../middleware/auth');

const router = express.Router();

// Base route for /api/news
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to the News API',
    endpoints: {
      headlines: '/api/news/headlines',
      search: '/api/news/search',
      categories: '/api/news/categories',
      sources: '/api/news/sources',
      category: '/api/news/category/:category',
      source: '/api/news/source/:source'
    }
  });
});

// Get top headlines
router.get('/headlines', auth, async (req, res) => {
  try {
    const preferences = req.user?.preferences || {};
    const articles = await newsService.getTopHeadlines(preferences);
    
    res.json({
      success: true,
      count: articles.length,
      articles: articles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch headlines',
      message: error.message
    });
  }
});

// Search news
router.get('/search', auth, async (req, res) => {
  try {
    const { q: query } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Query parameter is required'
      });
    }

    const preferences = req.user?.preferences || {};
    const articles = await newsService.searchNews(query, preferences);
    
    res.json({
      success: true,
      count: articles.length,
      query: query,
      articles: articles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to search news',
      message: error.message
    });
  }
});

// Get articles by category
router.get('/category/:category', auth, async (req, res) => {
  try {
    const { category } = req.params;
    const articles = await newsService.getArticlesByCategory(category);
    
    res.json({
      success: true,
      count: articles.length,
      category: category,
      articles: articles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch articles by category',
      message: error.message
    });
  }
});

// Get articles by source
router.get('/source/:source', auth, async (req, res) => {
  try {
    const { source } = req.params;
    const articles = await newsService.getArticlesBySource(source);
    
    res.json({
      success: true,
      count: articles.length,
      source: source,
      articles: articles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch articles by source',
      message: error.message
    });
  }
});

// Get available categories
router.get('/categories', (req, res) => {
  const categories = [
    'Technology',
    'World',
    'Business',
    'Science',
    'Health',
    'Sports',
    'Entertainment',
    'Politics'
  ];
  
  res.json({
    success: true,
    categories: categories
  });
});

// Get available sources
router.get('/sources', (req, res) => {
  const sources = [
    'BBC',
    'CNN',
    'Reuters',
    'TechCrunch',
    'The Verge',
    'Bloomberg',
    'Associated Press',
    'The Guardian',
    'New York Times',
    'Washington Post'
  ];
  
  res.json({
    success: true,
    sources: sources
  });
});

module.exports = router;