import Bookmark from '../../models/Bookmark.js';
import News from '../../models/News.js';
import User from '../../models/User.js';

// @desc    Get user's bookmarks
// @route   GET /api/user/bookmarks
// @access  Private
export const getBookmarks = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const bookmarks = await Bookmark.find({ user: req.user._id })
      .populate({
        path: 'news',
        select: 'title featuredImage videoUrl publishDate category district isBreakingNews content author views contentSections',
        populate: {
          path: 'category',
          select: 'name slug'
        }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Bookmark.countDocuments({ user: req.user._id });

    res.json({
      success: true,
      data: bookmarks.map(b => b.news),
      total,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add bookmark
// @route   POST /api/user/bookmarks
// @access  Private
export const addBookmark = async (req, res) => {
  try {
    const { newsId } = req.body;

    if (!newsId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide news ID'
      });
    }

    // Verify news exists
    const news = await News.findById(newsId);
    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News not found'
      });
    }

    // Check if already bookmarked
    const existingBookmark = await Bookmark.findOne({
      user: req.user._id,
      news: newsId
    });

    if (existingBookmark) {
      return res.status(400).json({
        success: false,
        message: 'News already bookmarked'
      });
    }

    const bookmark = await Bookmark.create({
      user: req.user._id,
      news: newsId
    });

    // Update user stats
    await User.findByIdAndUpdate(req.user._id, { $inc: { 'stats.bookmarks': 1 } });

    res.status(201).json({
      success: true,
      data: bookmark
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Remove bookmark
// @route   DELETE /api/user/bookmarks/:newsId
// @access  Private
export const removeBookmark = async (req, res) => {
  try {
    const { newsId } = req.params;

    const bookmark = await Bookmark.findOneAndDelete({
      user: req.user._id,
      news: newsId
    });

    if (!bookmark) {
      return res.status(404).json({
        success: false,
        message: 'Bookmark not found'
      });
    }

    // Update user stats
    await User.findByIdAndUpdate(req.user._id, { $inc: { 'stats.bookmarks': -1 } });

    res.json({
      success: true,
      message: 'Bookmark removed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Check if news is bookmarked
// @route   GET /api/user/bookmarks/check/:newsId
// @access  Private
export const checkBookmark = async (req, res) => {
  try {
    const { newsId } = req.params;

    const bookmark = await Bookmark.findOne({
      user: req.user._id,
      news: newsId
    });

    res.json({
      success: true,
      isBookmarked: !!bookmark
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

