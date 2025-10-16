const express = require('express');
const router = express.Router();
const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  likePost,
  addComment,
  getFeed,
  getFeaturedPosts,
  getGenerationConnection,
  getRecommendations
} = require('../controllers/posts');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getAllPosts);
router.get('/featured', getFeaturedPosts);
router.get('/generation-connection', getGenerationConnection);
router.get('/recommendations', getRecommendations);
router.get('/feed', protect, getFeed);
router.get('/:id', getPostById);

// Protected routes
router.post('/', protect, createPost);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);
router.post('/:id/like', protect, likePost);
router.post('/:id/comment', protect, addComment);

// Admin routes
router.put('/:id/feature', protect, authorize('admin'), updatePost);

module.exports = router;
