const express = require('express');
const router = express.Router();
const MasjidFavorite = require('../models/MasjidFavorite');
const { authenticateToken } = require('../middleware/auth');
const websocketService = require('../services/websocketService');

// @route   POST /api/masjid-favorites
// @desc    Add a masjid to favorites
// @access  Private
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      masjidId,
      masjidName,
      masjidCity,
      masjidRegion,
      masjidAddress,
      masjidImage,
      personalNote,
      isPublic = true,
      hasVisited = false,
      visitDate,
      rating,
      tags = []
    } = req.body;

    // Validate required fields
    if (!masjidId || !masjidName || !masjidCity || !masjidRegion) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc: masjidId, masjidName, masjidCity, masjidRegion'
      });
    }

    // Check if already favorited
    const existingFavorite = await MasjidFavorite.findOne({
      userId: req.user.id,
      masjidId
    });

    if (existingFavorite) {
      return res.status(400).json({
        success: false,
        message: 'Masjid đã có trong danh sách yêu thích'
      });
    }

    // Create new favorite
    const favorite = new MasjidFavorite({
      userId: req.user.id,
      masjidId,
      masjidName,
      masjidCity,
      masjidRegion,
      masjidAddress,
      masjidImage,
      personalNote,
      isPublic,
      hasVisited,
      visitDate: hasVisited && visitDate ? new Date(visitDate) : undefined,
      rating,
      tags
    });

    await favorite.save();

    // Populate user info for response
    await favorite.populate('userId', 'name picture googleId');

    // Broadcast real-time update to other users
    websocketService.broadcastFavoriteUpdate(req.user.id, {
      type: 'favorite_added',
      masjidId,
      masjidName,
      user: {
        id: req.user.id,
        name: req.user.name,
        picture: req.user.picture
      }
    });

    res.status(201).json({
      success: true,
      message: 'Đã thêm masjid vào danh sách yêu thích',
      data: favorite
    });

  } catch (error) {
    console.error('Error adding masjid favorite:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi thêm masjid yêu thích'
    });
  }
});

// @route   DELETE /api/masjid-favorites/:masjidId
// @desc    Remove a masjid from favorites
// @access  Private
router.delete('/:masjidId', authenticateToken, async (req, res) => {
  try {
    const { masjidId } = req.params;

    const favorite = await MasjidFavorite.findOneAndDelete({
      userId: req.user.id,
      masjidId
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy masjid trong danh sách yêu thích'
      });
    }

    // Broadcast real-time update to other users
    websocketService.broadcastFavoriteUpdate(req.user.id, {
      type: 'favorite_removed',
      masjidId,
      masjidName: favorite.masjidName,
      user: {
        id: req.user.id,
        name: req.user.name,
        picture: req.user.picture
      }
    });

    res.json({
      success: true,
      message: 'Đã xóa masjid khỏi danh sách yêu thích'
    });

  } catch (error) {
    console.error('Error removing masjid favorite:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi xóa masjid yêu thích'
    });
  }
});

// @route   GET /api/masjid-favorites/my
// @desc    Get user's favorite masjids
// @access  Private
router.get('/my', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, region, hasVisited } = req.query;
    const skip = (page - 1) * limit;

    const options = {
      limit: parseInt(limit),
      skip: parseInt(skip),
      region,
      hasVisited: hasVisited !== undefined ? hasVisited === 'true' : undefined
    };

    const favorites = await MasjidFavorite.getUserFavorites(req.user.id, options);
    const total = await MasjidFavorite.countDocuments({ userId: req.user.id });

    res.json({
      success: true,
      data: {
        favorites,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / limit),
          count: favorites.length,
          totalItems: total
        }
      }
    });

  } catch (error) {
    console.error('Error getting user favorites:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh sách yêu thích'
    });
  }
});

// @route   GET /api/masjid-favorites/batch
// @desc    Get favorite data for multiple masjids at once (PERFORMANCE OPTIMIZATION)
// @access  Public (no authentication required)
router.get('/batch', async (req, res) => {
  try {
    const { masjidIds, limit = 10 } = req.query;
    
    if (!masjidIds) {
      return res.status(400).json({
        success: false,
        message: 'masjidIds parameter is required'
      });
    }

    const ids = Array.isArray(masjidIds) ? masjidIds : masjidIds.split(',');
    const batchData = {};

    // Get all favorites for these masjids in one query
    const favorites = await MasjidFavorite.find({
      masjidId: { $in: ids },
      isPublic: true
    })
    .populate('userId', 'name picture googleId')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit) * ids.length);

    // Group by masjidId
    ids.forEach(masjidId => {
      const masjidFavorites = favorites.filter(fav => fav.masjidId === masjidId);
      
      batchData[masjidId] = {
        users: masjidFavorites.slice(0, parseInt(limit)).map(favorite => ({
          user: {
            id: favorite.userId._id,
            name: favorite.userId.name,
            picture: favorite.userId.picture,
            googleId: favorite.userId.googleId
          },
          favoriteInfo: {
            createdAt: favorite.createdAt,
            hasVisited: favorite.hasVisited,
            rating: favorite.rating
          }
        })),
        totalCount: masjidFavorites.length
      };
    });

    res.json({
      success: true,
      data: batchData
    });

  } catch (error) {
    console.error('Error getting batch masjid data:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy dữ liệu batch'
    });
  }
});

// @route   GET /api/masjid-favorites/masjid/:masjidId/users
// @desc    Get users who favorited a specific masjid (for avatar display)
// @access  Public (no authentication required)
router.get('/masjid/:masjidId/users', async (req, res) => {
  try {
    const { masjidId } = req.params;
    const { limit = 10 } = req.query;

    const users = await MasjidFavorite.getUsersWhoFavorited(masjidId, {
      limit: parseInt(limit)
    });

    // Transform data for frontend
    const usersData = users.map(favorite => ({
      user: {
        id: favorite.userId._id,
        name: favorite.userId.name,
        picture: favorite.userId.picture,
        googleId: favorite.userId.googleId
      },
      favoriteInfo: {
        createdAt: favorite.createdAt,
        hasVisited: favorite.hasVisited,
        rating: favorite.rating
      }
    }));

    res.json({
      success: true,
      data: {
        users: usersData,
        totalCount: users.length
      }
    });

  } catch (error) {
    console.error('Error getting masjid users:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh sách users'
    });
  }
});

// @route   GET /api/masjid-favorites/masjid/:masjidId/stats
// @desc    Get statistics for a specific masjid
// @access  Public (no authentication required)
router.get('/masjid/:masjidId/stats', async (req, res) => {
  try {
    const { masjidId } = req.params;

    const stats = await MasjidFavorite.getMasjidStats(masjidId);

    if (stats.length === 0) {
      return res.json({
        success: true,
        data: {
          totalFavorites: 0,
          averageRating: 0,
          visitedCount: 0,
          ratingDistribution: []
        }
      });
    }

    res.json({
      success: true,
      data: stats[0]
    });

  } catch (error) {
    console.error('Error getting masjid stats:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thống kê masjid'
    });
  }
});

// @route   GET /api/masjid-favorites/popular
// @desc    Get popular masjids (most favorited)
// @access  Public
router.get('/popular', async (req, res) => {
  try {
    const { limit = 10, region } = req.query;

    const popularMasjids = await MasjidFavorite.getPopularMasjids({
      limit: parseInt(limit),
      region
    });

    res.json({
      success: true,
      data: popularMasjids
    });

  } catch (error) {
    console.error('Error getting popular masjids:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy masjid phổ biến'
    });
  }
});

// @route   PUT /api/masjid-favorites/:masjidId
// @desc    Update masjid favorite (rating, note, visit status)
// @access  Private
router.put('/:masjidId', authenticateToken, async (req, res) => {
  try {
    const { masjidId } = req.params;
    const {
      personalNote,
      isPublic,
      hasVisited,
      visitDate,
      rating,
      tags
    } = req.body;

    const updateData = {};
    if (personalNote !== undefined) updateData.personalNote = personalNote;
    if (isPublic !== undefined) updateData.isPublic = isPublic;
    if (hasVisited !== undefined) updateData.hasVisited = hasVisited;
    if (visitDate !== undefined) updateData.visitDate = hasVisited ? new Date(visitDate) : null;
    if (rating !== undefined) updateData.rating = rating;
    if (tags !== undefined) updateData.tags = tags;

    const favorite = await MasjidFavorite.findOneAndUpdate(
      { userId: req.user.id, masjidId },
      updateData,
      { new: true }
    ).populate('userId', 'name picture googleId');

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy masjid trong danh sách yêu thích'
      });
    }

    res.json({
      success: true,
      message: 'Đã cập nhật thông tin masjid yêu thích',
      data: favorite
    });

  } catch (error) {
    console.error('Error updating masjid favorite:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật masjid yêu thích'
    });
  }
});

// @route   GET /api/masjid-favorites/check/:masjidId
// @desc    Check if user has favorited a masjid
// @access  Private
router.get('/check/:masjidId', authenticateToken, async (req, res) => {
  try {
    const { masjidId } = req.params;

    const favorite = await MasjidFavorite.isUserFavorited(req.user.id, masjidId);

    res.json({
      success: true,
      data: {
        isFavorited: !!favorite,
        favoriteId: favorite?._id
      }
    });

  } catch (error) {
    console.error('Error checking masjid favorite:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi kiểm tra masjid yêu thích'
    });
  }
});

// @route   GET /api/masjid-favorites/batch-check
// @desc    🚀 BATCH: Check favorite status for multiple masjids at once (PERFORMANCE OPTIMIZATION)
// @access  Private
router.get('/batch-check', authenticateToken, async (req, res) => {
  try {
    const { masjidIds } = req.query;
    
    if (!masjidIds) {
      return res.status(400).json({
        success: false,
        message: 'masjidIds parameter is required'
      });
    }

    const ids = Array.isArray(masjidIds) ? masjidIds : masjidIds.split(',');
    const batchData = {};

    // Get all user's favorites for these masjids in one query
    const userFavorites = await MasjidFavorite.find({
      userId: req.user.id,
      masjidId: { $in: ids }
    }).select('masjidId _id');

    // Create a map for quick lookup
    const favoriteMap = new Map();
    userFavorites.forEach(favorite => {
      favoriteMap.set(favorite.masjidId, favorite._id);
    });

    // Build response for all requested masjids
    ids.forEach(masjidId => {
      const favoriteId = favoriteMap.get(masjidId);
      batchData[masjidId] = {
        isFavorited: !!favoriteId,
        favoriteId: favoriteId
      };
    });

    res.json({
      success: true,
      data: batchData
    });

  } catch (error) {
    console.error('Error batch checking masjid favorites:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi kiểm tra batch masjid yêu thích'
    });
  }
});

module.exports = router;
