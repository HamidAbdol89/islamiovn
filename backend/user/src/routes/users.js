const express = require('express');
const router = express.Router();
const Bookmark = require('../models/Bookmark');
const { authenticateToken } = require('../middleware/auth');
const { successResponse, errorResponse, paginate, formatPaginationResponse } = require('../utils/helpers');

// Get user statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const bookmarkStats = await Bookmark.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
        },
      },
    ]);

    const totalBookmarks = await Bookmark.countDocuments({ userId });

    const recentBookmarks = await Bookmark.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('type title createdAt');

    const stats = {
      totalBookmarks,
      byType: bookmarkStats.reduce((acc, stat) => {
        acc[stat._id] = { total: stat.count };
        return acc;
      }, {}),
      recentActivity: recentBookmarks,
    };

    return successResponse(res, stats, 'User statistics retrieved');
  } catch (error) {
    console.error('Get user stats error:', error);
    return errorResponse(res, 'Failed to get user statistics', 500, error.message);
  }
});

// Get user activity feed
router.get('/activity', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;
    const { skip, limit: limitNum } = paginate(parseInt(page), parseInt(limit));

    const bookmarks = await Bookmark.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .select('type title content metadata createdAt');

    const total = await Bookmark.countDocuments({ userId });
    const response = formatPaginationResponse(bookmarks, parseInt(page), limitNum, total);

    return successResponse(res, response, 'User activity retrieved');
  } catch (error) {
    console.error('Get user activity error:', error);
    return errorResponse(res, 'Failed to get user activity', 500, error.message);
  }
});

// Search user bookmarks
router.get('/search', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { q, type, page = 1, limit = 20 } = req.query;

    if (!q || q.trim().length < 2) {
      return errorResponse(res, 'Search query must be at least 2 characters', 400);
    }

    const { skip, limit: limitNum } = paginate(parseInt(page), parseInt(limit));

    const searchQuery = {
      userId,
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } },
        { notes: { $regex: q, $options: 'i' } },
      ],
    };

    if (type) searchQuery.type = type;

    const bookmarks = await Bookmark.find(searchQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .select('type title content metadata createdAt');

    const total = await Bookmark.countDocuments(searchQuery);
    const response = formatPaginationResponse(bookmarks, parseInt(page), limitNum, total);

    return successResponse(res, response, 'Search completed');
  } catch (error) {
    console.error('Search bookmarks error:', error);
    return errorResponse(res, 'Search failed', 500, error.message);
  }
});

// Export user data
router.get('/export', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const bookmarks = await Bookmark.find({ userId })
      .sort({ createdAt: -1 })
      .select('-__v -userId');

    const exportData = {
      user: { id: userId, email: req.user.email, name: req.user.name },
      bookmarks,
      exportedAt: new Date().toISOString(),
      totalBookmarks: bookmarks.length,
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="muslimviet-backup-${Date.now()}.json"`
    );

    return res.json(exportData);
  } catch (error) {
    console.error('Export data error:', error);
    return errorResponse(res, 'Failed to export data', 500, error.message);
  }
});

module.exports = router;
