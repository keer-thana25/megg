const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    maxlength: [2000, 'Content cannot exceed 2000 characters']
  },
  mediaType: {
    type: String,
    enum: ['text', 'image', 'video'],
    default: 'text'
  },
  mediaUrl: {
    type: String,
    default: ''
  },
  mediaBase64: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ['Spirituality', 'Literature', 'Art', 'Heritage', 'Inspiration', 'Technology', 'Music', 'History'],
    required: true
  },
  generation: {
    type: String,
    enum: ['older', 'younger'],
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    text: {
      type: String,
      required: true,
      maxlength: [500, 'Comment cannot exceed 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for better query performance
postSchema.index({ category: 1, generation: 1, createdAt: -1 });
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ isFeatured: 1, createdAt: -1 });

// Virtual for like count
postSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for comment count
postSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// Ensure virtual fields are serialized
postSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Post', postSchema);
