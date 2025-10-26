const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  externalId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    default: ''
  },
  publishedAt: {
    type: Date,
    required: true
  },
  source: {
    name: {
      type: String,
      required: true
    },
    id: String
  },
  category: {
    type: String,
    enum: ['Technology', 'World', 'Business', 'Science', 'Health', 'Sports', 'Entertainment', 'Politics', 'General'],
    default: 'General'
  },
  author: {
    type: String,
    default: 'Unknown Author'
  },
  readTime: {
    type: Number,
    default: 1
  },
  credits: {
    type: Number,
    default: 5
  },
  tags: [String],
  language: {
    type: String,
    default: 'en'
  },
  country: {
    type: String,
    default: 'us'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better query performance
articleSchema.index({ publishedAt: -1 });
articleSchema.index({ category: 1 });
articleSchema.index({ 'source.name': 1 });
articleSchema.index({ language: 1, country: 1 });

module.exports = mongoose.model('Article', articleSchema);
