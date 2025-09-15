const express = require('express');
const router = express.Router();
const Bookmark = require('../models/Bookmark');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const { successResponse, errorResponse, paginate, formatPaginationResponse, isValidObjectId } = require('../utils/helpers');

// Create bookmark
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { user } = req;
    const { type, itemId, title, content, metadata, tags, notes, isPublic } = req.body;
    
    // Validate required fields
    if (!type || !itemId || !title || !content) {
      return errorResponse(res, 'Type, itemId, title, and content are required', 400);
    }
    
    // Check if bookmark already exists
    const existingBookmark = await Bookmark.findOne({ 
      userId: user._id, 
      type, 
      itemId 
    });
    
    if (existingBookmark) {
      return errorResponse(res, 'Bookmark already exists', 409);
    }
    
    // Create new bookmark
    const bookmark = new Bookmark({
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
    
    await bookmark.save();
    
    return successResponse(res, bookmark, 'Bookmark created successfully', 201);
  } catch (error) {
    console.error('Create bookmark error:', error);
    return errorResponse(res, 'Failed to create bookmark', 500, error.message);
  }
});

// Get user bookmarks
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
    
    const bookmarks = await Bookmark.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum)
      .select('-__v');
    
    const total = await Bookmark.countDocuments(query);
    
    const response = formatPaginationResponse(bookmarks, parseInt(page), limitNum, total);
    
    return successResponse(res, response, 'Bookmarks retrieved successfully');
  } catch (error) {
    console.error('Get bookmarks error:', error);
    return errorResponse(res, 'Failed to get bookmarks', 500, error.message);
  }
});

// Get single bookmark
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { user } = req;
    const { id } = req.params;
    
    if (!isValidObjectId(id)) {
      return errorResponse(res, 'Invalid bookmark ID', 400);
    }
    
    const bookmark = await Bookmark.findOne({ _id: id, userId: user._id });
    
    if (!bookmark) {
      return errorResponse(res, 'Bookmark not found', 404);
    }
    
    // Increment view count
    await bookmark.incrementView();
    
    return successResponse(res, bookmark, 'Bookmark retrieved successfully');
  } catch (error) {
    console.error('Get bookmark error:', error);
    return errorResponse(res, 'Failed to get bookmark', 500, error.message);
  }
});

// Update bookmark
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { user } = req;
    const { id } = req.params;
    const updateData = req.body;
    
    if (!isValidObjectId(id)) {
      return errorResponse(res, 'Invalid bookmark ID', 400);
    }
    
    const bookmark = await Bookmark.findOne({ _id: id, userId: user._id });
    
    if (!bookmark) {
      return errorResponse(res, 'Bookmark not found', 404);
    }
    
    // Update allowed fields
    const allowedFields = ['title', 'content', 'metadata', 'tags', 'notes', 'isPublic'];
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        bookmark[field] = updateData[field];
      }
    });
    
    await bookmark.save();
    
    return successResponse(res, bookmark, 'Bookmark updated successfully');
  } catch (error) {
    console.error('Update bookmark error:', error);
    return errorResponse(res, 'Failed to update bookmark', 500, error.message);
  }
});

// Delete bookmark
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { user } = req;
    const { id } = req.params;
    
    if (!isValidObjectId(id)) {
      return errorResponse(res, 'Invalid bookmark ID', 400);
    }
    
    const bookmark = await Bookmark.findOne({ _id: id, userId: user._id });
    
    if (!bookmark) {
      return errorResponse(res, 'Bookmark not found', 404);
    }
    
    await Bookmark.findByIdAndDelete(id);
    
    return successResponse(res, null, 'Bookmark deleted successfully');
  } catch (error) {
    console.error('Delete bookmark error:', error);
    return errorResponse(res, 'Failed to delete bookmark', 500, error.message);
  }
});


// Get popular bookmarks (public)
router.get('/public/popular', optionalAuth, async (req, res) => {
  try {
    const { type, limit = 10 } = req.query;
    
    const bookmarks = await Bookmark.getPopularBookmarks(type, parseInt(limit));
    
    return successResponse(res, bookmarks, 'Popular bookmarks retrieved');
  } catch (error) {
    console.error('Get popular bookmarks error:', error);
    return errorResponse(res, 'Failed to get popular bookmarks', 500, error.message);
  }
});

// Bulk operations
router.post('/bulk', authenticateToken, async (req, res) => {
  try {
    const { user } = req;
    const { action, bookmarkIds } = req.body;
    
    if (!action || !bookmarkIds || !Array.isArray(bookmarkIds)) {
      return errorResponse(res, 'Action and bookmarkIds array are required', 400);
    }
    
    const validIds = bookmarkIds.filter(id => isValidObjectId(id));
    
    if (validIds.length === 0) {
      return errorResponse(res, 'No valid bookmark IDs provided', 400);
    }
    
    let result;
    
    switch (action) {
      case 'delete':
        result = await Bookmark.deleteMany({ 
          _id: { $in: validIds }, 
          userId: user._id 
        });
        break;
        
      case 'make_public':
        result = await Bookmark.updateMany(
          { _id: { $in: validIds }, userId: user._id },
          { $set: { isPublic: true } }
        );
        break;
        
      case 'make_private':
        result = await Bookmark.updateMany(
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
