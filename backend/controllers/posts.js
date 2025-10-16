const Post = require('../models/Post');
const User = require('../models/User');

// @desc    Get all posts with pagination
// @route   GET /api/posts
// @access  Public
const getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const generation = req.query.generation;

    const skip = (page - 1) * limit;

    let query = { isActive: true };

    if (category) query.category = category;
    if (generation) query.generation = generation;

    const posts = await Post.find(query)
      .populate('author', 'username generation profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments(query);

    res.json({
      success: true,
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error getting posts' });
  }
};

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username generation profilePicture bio')
      .populate('likes.user', 'username')
      .populate('comments.user', 'username profilePicture');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Increment view count
    post.views += 1;
    await post.save();

    res.json({
      success: true,
      post
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error getting post' });
  }
};

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res) => {
  try {
    const { title, content, mediaType, mediaUrl, mediaBase64, category } = req.body;

    const post = await Post.create({
      title,
      content,
      mediaType: mediaType || 'text',
      mediaUrl,
      mediaBase64,
      category,
      generation: req.user.generation,
      author: req.user.id
    });

    await post.populate('author', 'username generation profilePicture');

    res.status(201).json({
      success: true,
      post
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating post' });
  }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user owns the post or is admin
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }

    const { title, content, mediaType, mediaUrl, mediaBase64, category, isFeatured } = req.body;

    if (title) post.title = title;
    if (content) post.content = content;
    if (mediaType) post.mediaType = mediaType;
    if (mediaUrl !== undefined) post.mediaUrl = mediaUrl;
    if (mediaBase64 !== undefined) post.mediaBase64 = mediaBase64;
    if (category) post.category = category;
    if (isFeatured !== undefined && req.user.role === 'admin') {
      post.isFeatured = isFeatured;
    }

    await post.save();
    await post.populate('author', 'username generation profilePicture');

    res.json({
      success: true,
      post
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating post' });
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user owns the post or is admin
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting post' });
  }
};

// @desc    Like/Unlike post
// @route   POST /api/posts/:id/like
// @access  Private
const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const likeIndex = post.likes.findIndex(
      like => like.user.toString() === req.user.id
    );

    if (likeIndex > -1) {
      // Unlike the post
      post.likes.splice(likeIndex, 1);
    } else {
      // Like the post
      post.likes.push({ user: req.user.id });
    }

    await post.save();

    res.json({
      success: true,
      likes: post.likes.length,
      isLiked: likeIndex === -1
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error liking post' });
  }
};

// @desc    Add comment to post
// @route   POST /api/posts/:id/comment
// @access  Private
const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.comments.push({
      user: req.user.id,
      text
    });

    await post.save();
    await post.populate('comments.user', 'username profilePicture');

    res.json({
      success: true,
      comments: post.comments
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error adding comment' });
  }
};

// @desc    Get user feed
// @route   GET /api/posts/feed
// @access  Private
const getFeed = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const following = user.following.map(f => f.toString());

    const posts = await Post.find({
      $or: [
        { author: { $in: following } },
        { author: req.user.id }
      ],
      isActive: true
    })
      .populate('author', 'username generation profilePicture')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      posts
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error getting feed' });
  }
};

// @desc    Get featured posts
// @route   GET /api/posts/featured
// @access  Public
const getFeaturedPosts = async (req, res) => {
  try {
    const posts = await Post.find({ isFeatured: true, isActive: true })
      .populate('author', 'username generation profilePicture')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      posts
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error getting featured posts' });
  }
};

// @desc    Get generation connection posts (alternating older/younger)
// @route   GET /api/posts/generation-connection
// @access  Public
const getGenerationConnection = async (req, res) => {
  try {
    const olderPosts = await Post.find({
      generation: 'older',
      isActive: true
    })
      .populate('author', 'username generation profilePicture')
      .sort({ createdAt: -1 })
      .limit(5);

    const youngerPosts = await Post.find({
      generation: 'younger',
      isActive: true
    })
      .populate('author', 'username generation profilePicture')
      .sort({ createdAt: -1 })
      .limit(5);

    // Alternate between older and younger posts
    const alternatingPosts = [];
    const maxLength = Math.max(olderPosts.length, youngerPosts.length);

    for (let i = 0; i < maxLength; i++) {
      if (olderPosts[i]) alternatingPosts.push(olderPosts[i]);
      if (youngerPosts[i]) alternatingPosts.push(youngerPosts[i]);
    }

    res.json({
      success: true,
      posts: alternatingPosts
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error getting generation connection posts' });
  }
};

// @desc    Get AI recommendations based on user interests
// @route   GET /api/posts/recommendations
// @access  Public
const getRecommendations = async (req, res) => {
  try {
    const userId = req.query.userId;
    let categories = [];

    if (userId) {
      const user = await User.findById(userId);
      categories = user ? user.interests : [];
    }

    // If no user or no interests, recommend popular categories
    if (categories.length === 0) {
      categories = ['Spirituality', 'Literature', 'Art', 'Heritage', 'Inspiration'];
    }

    const posts = await Post.find({
      category: { $in: categories },
      isActive: true,
      ...(userId && { author: { $ne: userId } }) // Exclude user's own posts
    })
      .populate('author', 'username generation profilePicture')
      .sort({ likes: -1, createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      posts,
      basedOn: userId ? 'user_interests' : 'popular_categories'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error getting recommendations' });
  }
};

module.exports = {
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
};
