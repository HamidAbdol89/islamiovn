const express = require('express');
const router = express.Router();
const Favorite = require('../models/Favorite');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const { successResponse, errorResponse, paginate, formatPaginationResponse, isValidObjectId } = require('../utils/helpers');

// Create favorite
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { user } = req;
    const { type, itemId, title, content, metadata, tags, notes, isPublic } = req.body;
    
    // Validate required fields
    if (!type || !itemId || !title || !content) {
      return errorResponse(res, 'Type, itemId, title, and content are required', 400);
    }
    
    // Check if favorite already exists
    const existingFavorite = await Favorite.findOne({ 
      userId: user._id, 
      type, 
      itemId 
    });
    
    if (existingFavorite) {
      return errorResponse(res, 'Favorite already exists', 409);
    }
    
    // Create new favorite
    const favorite = new Favorite({
      userId: user._id,
      type,
      itemId,
      title,
      content,
      metadata: metadata || {},
      tags: tags || [],
      notes: notes || '',
      isPublic: isPublic || false
    });
    
    await favorite.save();
    
    return successResponse(res, favorite, 'Favorite created successfully', 201);
  } catch (error) {
    console.error('Create favorite error:', error);
    return errorResponse(res, 'Failed to create favorite', 500, error.message);
  }
});

// Get user favorites
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { user } = req;
    const { type, page = 1, limit = 20, sort = 'createdAt', order = 'desc' } = req.query;
    
    const { skip, limit: limitNum } = paginate(parseInt(page), parseInt(limit));
    
    // Build query
    const query = { userId: user._id };
    if (type) query.type = type;
    
    // Build sort object
    const sortObj = {};
    sortObj[sort] = order === 'desc' ? -1 : 1;
    
    const favorites = await Favorite.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum)
      .select('-__v');
    
    const total = await Favorite.countDocuments(query);
    
    const response = formatPaginationResponse(favorites, parseInt(page), limitNum, total);
    
    return successResponse(res, response, 'Favorites retrieved successfully');
  } catch (error) {
    console.error('Get favorites error:', error);
    return errorResponse(res, 'Failed to get favorites', 500, error.message);
  }
});

// Get single favorite
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { user } = req;
    const { id } = req.params;
    
    if (!isValidObjectId(id)) {
      return errorResponse(res, 'Invalid favorite ID', 400);
    }
    
    const favorite = await Favorite.findOne({ _id: id, userId: user._id });
    
    if (!favorite) {
      return errorResponse(res, 'Favorite not found', 404);
    }
    
    // Increment view count
    await favorite.incrementView();
    
    return successResponse(res, favorite, 'Favorite retrieved successfully');
  } catch (error) {
    console.error('Get favorite error:', error);
    return errorResponse(res, 'Failed to get favorite', 500, error.message);
  }
});

// Update favorite
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { user } = req;
    const { id } = req.params;
    const updateData = req.body;
    
    if (!isValidObjectId(id)) {
      return errorResponse(res, 'Invalid favorite ID', 400);
    }
    
    const favorite = await Favorite.findOne({ _id: id, userId: user._id });
    
    if (!favorite) {
      return errorResponse(res, 'Favorite not found', 404);
    }
    
    // Update allowed fields
    const allowedFields = ['title', 'content', 'metadata', 'tags', 'notes', 'isPublic'];
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        favorite[field] = updateData[field];
      }
    });
    
    await favorite.save();
    
    return successResponse(res, favorite, 'Favorite updated successfully');
  } catch (error) {
    console.error('Update favorite error:', error);
    return errorResponse(res, 'Failed to update favorite', 500, error.message);
  }
});

// Delete favorite
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { user } = req;
    const { id } = req.params;
    
    if (!isValidObjectId(id)) {
      return errorResponse(res, 'Invalid favorite ID', 400);
    }
    
    const favorite = await Favorite.findOne({ _id: id, userId: user._id });
    
    if (!favorite) {
      return errorResponse(res, 'Favorite not found', 404);
    }
    
    await Favorite.findByIdAndDelete(id);
    
    return successResponse(res, null, 'Favorite deleted successfully');
  } catch (error) {
    console.error('Delete favorite error:', error);
    return errorResponse(res, 'Failed to delete favorite', 500, error.message);
  }
});

// Check if item is favorited
router.get('/check/:type/:itemId', authenticateToken, async (req, res) => {
  try {
    const { user } = req;
    const { type, itemId } = req.params;
    
    const favorite = await Favorite.findOne({ 
      userId: user._id, 
      type, 
      itemId 
    });
    
    return successResponse(res, { 
      isFavorited: !!favorite,
      favoriteId: favorite?._id 
    }, 'Check favorite status');
  } catch (error) {
    console.error('Check favorite error:', error);
    return errorResponse(res, 'Failed to check favorite status', 500, error.message);
  }
});

// Toggle favorite (add if not exists, remove if exists)
router.post('/toggle', authenticateToken, async (req, res) => {
  try {
    const { user } = req;
    const { type, itemId, title, content, metadata, tags, notes, isPublic } = req.body;
    
    // Validate required fields
    if (!type || !itemId || !title || !content) {
      return errorResponse(res, 'Type, itemId, title, and content are required', 400);
    }
    
    // Check if favorite already exists
    const existingFavorite = await Favorite.findOne({ 
      userId: user._id, 
      type, 
      itemId 
    });
    
    if (existingFavorite) {
      // Remove favorite
      await Favorite.findByIdAndDelete(existingFavorite._id);
      return successResponse(res, { 
        isFavorited: false, 
        message: 'Favorite removed' 
      }, 'Favorite removed successfully');
    } else {
      // Add favorite
      const favorite = new Favorite({
        userId: user._id,
        type,
        itemId,
        title,
        content,
        metadata: metadata || {},
        tags: tags || [],
        notes: notes || '',
        isPublic: isPublic || false
      });
      
      await favorite.save();
      
      return successResponse(res, { 
        isFavorited: true, 
        favorite,
        message: 'Favorite added' 
      }, 'Favorite added successfully');
    }
  } catch (error) {
    console.error('Toggle favorite error:', error);
    return errorResponse(res, 'Failed to toggle favorite', 500, error.message);
  }
});

// Get popular favorites (public)
router.get('/public/popular', optionalAuth, async (req, res) => {
  try {
    const { type, limit = 10 } = req.query;
    
    const favorites = await Favorite.getPopularFavorites(type, parseInt(limit));
    
    return successResponse(res, favorites, 'Popular favorites retrieved');
  } catch (error) {
    console.error('Get popular favorites error:', error);
    return errorResponse(res, 'Failed to get popular favorites', 500, error.message);
  }
});

// Bulk operations
router.post('/bulk', authenticateToken, async (req, res) => {
  try {
    const { user } = req;
    const { action, favoriteIds } = req.body;
    
    if (!action || !favoriteIds || !Array.isArray(favoriteIds)) {
      return errorResponse(res, 'Action and favoriteIds array are required', 400);
    }
    
    const validIds = favoriteIds.filter(id => isValidObjectId(id));
    
    if (validIds.length === 0) {
      return errorResponse(res, 'No valid favorite IDs provided', 400);
    }
    
    let result;
    
    switch (action) {
      case 'delete':
        result = await Favorite.deleteMany({ 
          _id: { $in: validIds }, 
          userId: user._id 
        });
        break;
        
      case 'make_public':
        result = await Favorite.updateMany(
          { _id: { $in: validIds }, userId: user._id },
          { $set: { isPublic: true } }
        );
        break;
        
      case 'make_private':
        result = await Favorite.updateMany(
          { _id: { $in: validIds }, userId: user._id },
          { $set: { isPublic: false } }
        );
        break;
        
      default:
        return errorResponse(res, 'Invalid action', 400);
    }
    
    return successResponse(res, { 
      modifiedCount: result.modifiedCount || result.deletedCount,
      matchedCount: result.matchedCount 
    }, `Bulk ${action} completed`);
  } catch (error) {
    console.error('Bulk operation error:', error);
    return errorResponse(res, 'Bulk operation failed', 500, error.message);
  }
});

module.exports = router;
