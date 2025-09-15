const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticateGoogleToken, authenticateToken } = require('../middleware/auth');
const { generateToken, successResponse, errorResponse } = require('../utils/helpers');

// Google OAuth login/register
router.post('/google', authenticateGoogleToken, async (req, res) => {
  try {
    const { user } = req;
    
    // Generate JWT token
    const token = generateToken(user._id);
    
    // Return user data and token
    return successResponse(res, {
      user: user.getProfile(),
      token
    }, 'Login successful');
  } catch (error) {
    console.error('Google auth error:', error);
    return errorResponse(res, 'Authentication failed', 500, error.message);
  }
});

// Get current user profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const { user } = req;
    
    return successResponse(res, {
      user: user.getProfile()
    }, 'User profile retrieved');
  } catch (error) {
    console.error('Get profile error:', error);
    return errorResponse(res, 'Failed to get profile', 500, error.message);
  }
});

// Update user profile
router.put('/profile', authenticateGoogleToken, async (req, res) => {
  try {
    const { user } = req;
    const { name, preferences } = req.body;
    
    // Update allowed fields
    if (name) user.name = name;
    if (preferences) {
      user.preferences = { ...user.preferences, ...preferences };
    }
    
    await user.save();
    
    return successResponse(res, {
      user: user.getProfile()
    }, 'Profile updated successfully');
  } catch (error) {
    console.error('Update profile error:', error);
    return errorResponse(res, 'Failed to update profile', 500, error.message);
  }
});

// Delete user account
router.delete('/account', authenticateGoogleToken, async (req, res) => {
  try {
    const { user } = req;
    
    // Soft delete - mark as inactive
    user.isActive = false;
    await user.save();
    
    return successResponse(res, null, 'Account deleted successfully');
  } catch (error) {
    console.error('Delete account error:', error);
    return errorResponse(res, 'Failed to delete account', 500, error.message);
  }
});

// Refresh token endpoint
router.post('/refresh', authenticateGoogleToken, async (req, res) => {
  try {
    const { user } = req;
    
    // Generate new token
    const token = generateToken(user._id);
    
    return successResponse(res, {
      token
    }, 'Token refreshed successfully');
  } catch (error) {
    console.error('Refresh token error:', error);
    return errorResponse(res, 'Failed to refresh token', 500, error.message);
  }
});

// Logout endpoint (client-side token removal)
router.post('/logout', authenticateGoogleToken, async (req, res) => {
  try {
    // Update last login time
    await req.user.updateLastLogin();
    
    return successResponse(res, null, 'Logout successful');
  } catch (error) {
    console.error('Logout error:', error);
    return errorResponse(res, 'Logout failed', 500, error.message);
  }
});

module.exports = router;
