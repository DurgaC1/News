const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'fallback-secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// Base route for GET /api/auth/signup
router.get('/signup', (req, res) => {
  res.json({
    success: true,
    message: 'Signup endpoint for creating a new user account',
    method: 'POST',
    requiredFields: ['email', 'password', 'name'],
    example: {
      email: 'user@example.com',
      password: 'secure123',
      name: 'John Doe'
    }
  });
});

// Sign up with email and password
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        error: 'Email, password, and name are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      email: email.toLowerCase() 
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists'
      });
    }

    // Create new user
    const defaultPreferences = {
      categories: ['Technology', 'World', 'Business', 'Science', 'Health'],
      sources: ['BBC', 'CNN', 'Reuters', 'TechCrunch', 'The Verge'],
      languages: ['en'],
      countries: ['us']
    };

    const user = new User({
      email: email.toLowerCase().trim(),
      password: password,
      name: name.trim(),
      provider: 'local',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=667eea&color=fff`,
      credits: 100,
      preferences: defaultPreferences,
      savedArticles: [],
      readingHistory: []
    });

    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token: token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        credits: user.credits,
        preferences: user.preferences
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create account',
      message: error.message
    });
  }
});

// Sign in with email and password
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Check if user has a password (local authentication)
    if (!user.password) {
      return res.status(401).json({
        success: false,
        error: 'This account was created with social login. Please use that method to sign in.'
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);

    res.json({
      success: true,
      token: token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        credits: user.credits,
        preferences: user.preferences
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to sign in',
      message: error.message
    });
  }
});

// Developer login (no authentication required)
router.post('/developer', async (req, res) => {
  try {
    const defaultPreferences = {
      categories: ['Technology', 'World', 'Business', 'Science', 'Health'],
      sources: ['BBC', 'CNN', 'Reuters', 'TechCrunch', 'The Verge'],
      languages: ['en'],
      countries: ['us']
    };

    // Find or create developer user
    let user = await User.findOne({ provider: 'developer' });
    
    if (!user) {
      user = new User({
        email: 'developer@newsapp.com',
        name: 'Developer User',
        avatar: 'https://via.placeholder.com/150/667eea/ffffff?text=DEV',
        provider: 'developer',
        providerId: 'developer-user',
        credits: 1000,
        preferences: defaultPreferences,
        savedArticles: [],
        readingHistory: []
      });
      await user.save();
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token: token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        credits: user.credits,
        preferences: user.preferences
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create developer account',
      message: error.message
    });
  }
});

// Guest login
router.post('/guest', async (req, res) => {
  try {
    const guestId = `guest-${Date.now()}`;
    const defaultPreferences = {
      categories: ['Technology', 'World', 'Business'],
      sources: ['BBC', 'CNN', 'Reuters'],
      languages: ['en'],
      countries: ['us']
    };

    const user = new User({
      email: `${guestId}@guest.newsapp.com`,
      name: 'Guest User',
      avatar: 'https://via.placeholder.com/150/cccccc/ffffff?text=GUEST',
      provider: 'guest',
      providerId: guestId,
      credits: 50,
      preferences: defaultPreferences,
      savedArticles: [],
      readingHistory: []
    });

    await user.save();

    const token = generateToken(user._id);

    res.json({
      success: true,
      token: token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        credits: user.credits,
        preferences: user.preferences
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create guest account',
      message: error.message
    });
  }
});

// Google OAuth callback (simplified for now)
router.post('/google', async (req, res) => {
  try {
    const { email, name, picture, googleId } = req.body;

    if (!email || !name) {
      return res.status(400).json({
        success: false,
        error: 'Email and name are required'
      });
    }

    let user = await User.findOne({ 
      $or: [
        { email: email },
        { providerId: googleId }
      ]
    });

    if (!user) {
      const defaultPreferences = {
        categories: ['Technology', 'World', 'Business'],
        sources: ['Google News', 'BBC', 'CNN'],
        languages: ['en'],
        countries: ['us']
      };

      user = new User({
        email: email,
        name: name,
        avatar: picture || '',
        provider: 'google',
        providerId: googleId || '',
        credits: 100,
        preferences: defaultPreferences,
        savedArticles: [],
        readingHistory: []
      });
      await user.save();
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token: token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        credits: user.credits,
        preferences: user.preferences
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to authenticate with Google',
      message: error.message
    });
  }
});

// Facebook OAuth callback (simplified for now)
router.post('/facebook', async (req, res) => {
  try {
    const { email, name, picture, facebookId } = req.body;

    if (!email || !name) {
      return res.status(400).json({
        success: false,
        error: 'Email and name are required'
      });
    }

    let user = await User.findOne({ 
      $or: [
        { email: email },
        { providerId: facebookId }
      ]
    });

    if (!user) {
      const defaultPreferences = {
        categories: ['Technology', 'World', 'Business'],
        sources: ['Facebook News', 'BBC', 'CNN'],
        languages: ['en'],
        countries: ['us']
      };

      user = new User({
        email: email,
        name: name,
        avatar: picture?.data?.url || '',
        provider: 'facebook',
        providerId: facebookId || '',
        credits: 100,
        preferences: defaultPreferences,
        savedArticles: [],
        readingHistory: []
      });
      await user.save();
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token: token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        credits: user.credits,
        preferences: user.preferences
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to authenticate with Facebook',
      message: error.message
    });
  }
});

// Verify token
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        credits: user.credits,
        preferences: user.preferences
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Invalid token',
      message: error.message
    });
  }
});

module.exports = router;