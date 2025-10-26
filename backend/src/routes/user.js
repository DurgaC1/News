const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

// Get user profile
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
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
        preferences: user.preferences,
        savedArticles: user.savedArticles,
        readingHistory: user.readingHistory,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch user profile",
      message: error.message,
    });
  }
});

// Update user preferences
router.put("/preferences", auth, async (req, res) => {
  try {
    const { categories, sources, languages, countries } = req.body;

    const updateData = {};
    if (categories) updateData["preferences.categories"] = categories;
    if (sources) updateData["preferences.sources"] = sources;
    if (languages) updateData["preferences.languages"] = languages;
    if (countries) updateData["preferences.countries"] = countries;

    const user = await User.findByIdAndUpdate(req.user.userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
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
        preferences: user.preferences,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to update preferences",
      message: error.message,
    });
  }
});

// Update user profile
router.put("/profile", auth, async (req, res) => {
  try {
    const { name, avatar } = req.body;

    const updateData = {};
    if (name) updateData.name = name.trim();
    if (avatar !== undefined) updateData.avatar = avatar;

    const user = await User.findByIdAndUpdate(req.user.userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
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
        preferences: user.preferences,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to update profile",
      message: error.message,
    });
  }
});

// Change password
router.put("/change-password", auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: "New password must be at least 6 characters",
      });
    }

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Check if user has a password set
    if (!user.password) {
      return res.status(400).json({
        success: false,
        error:
          "This account does not have a password set. Please use your social login method.",
      });
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: "Current password is incorrect",
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to change password",
      message: error.message,
    });
  }
});

// Save article
router.post("/save-article", auth, async (req, res) => {
  try {
    const { articleId } = req.body;

    if (!articleId) {
      return res.status(400).json({
        success: false,
        error: "Article ID is required",
      });
    }

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Check if article is already saved
    if (user.savedArticles.includes(articleId)) {
      return res.status(400).json({
        success: false,
        error: "Article already saved",
      });
    }

    user.savedArticles.push(articleId);
    await user.save();

    res.json({
      success: true,
      message: "Article saved successfully",
      savedArticles: user.savedArticles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to save article",
      message: error.message,
    });
  }
});

// Remove saved article
router.delete("/save-article/:articleId", auth, async (req, res) => {
  try {
    const { articleId } = req.params;

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    user.savedArticles = user.savedArticles.filter(
      (id) => id.toString() !== articleId
    );
    await user.save();

    res.json({
      success: true,
      message: "Article removed from saved",
      savedArticles: user.savedArticles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to remove saved article",
      message: error.message,
    });
  }
});

// Add to reading history
router.post("/reading-history", auth, async (req, res) => {
  try {
    const { articleId } = req.body;

    if (!articleId) {
      return res.status(400).json({
        success: false,
        error: "Article ID is required",
      });
    }

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Remove existing entry if it exists
    user.readingHistory = user.readingHistory.filter(
      (entry) => entry.articleId !== articleId
    );

    // Add new entry at the beginning
    user.readingHistory.unshift({
      articleId: articleId,
      readAt: new Date(),
    });

    // Keep only last 100 entries
    if (user.readingHistory.length > 100) {
      user.readingHistory = user.readingHistory.slice(0, 100);
    }

    await user.save();

    res.json({
      success: true,
      message: "Added to reading history",
      readingHistory: user.readingHistory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: " DAV to add to reading history",
      message: error.message,
    });
  }
});

// Get saved articles
router.get("/saved-articles", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.json({
      success: true,
      articles: user.savedArticles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch saved articles",
      message: error.message,
    });
  }
});

// Get reading history
router.get("/reading-history", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.json({
      success: true,
      readingHistory: user.readingHistory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch reading history",
      message: error.message,
    });
  }
});

module.exports = router;