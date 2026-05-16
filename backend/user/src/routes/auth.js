const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

/**
 * POST /api/auth/firebase
 * Called by frontend after Firebase login to sync user with our DB.
 * Firebase Admin verifies the token — we just store/update user info.
 */
router.post('/firebase', authenticateToken, async (req, res) => {
  try {
    // req.user is set by authenticateToken middleware
    // Nothing else needed — Firebase handles auth, we just acknowledge
    return res.json({
      success: true,
      data: { user: req.user },
      message: 'User synced',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Sync failed' });
  }
});

/**
 * GET /api/auth/me
 * Get current user info from token.
 */
router.get('/me', authenticateToken, (req, res) => {
  res.json({ success: true, data: { user: req.user } });
});

module.exports = router;
