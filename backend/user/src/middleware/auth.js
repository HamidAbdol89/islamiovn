const { verifyIdToken } = require('../lib/firebaseAdmin');

/**
 * Require a valid Firebase ID token.
 * Attaches req.user = { id, email, name, picture }
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const decoded = await verifyIdToken(token);

    req.user = {
      id: decoded.uid,
      email: decoded.email ?? '',
      name: decoded.name ?? '',
      picture: decoded.picture ?? '',
    };

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

/**
 * Optional auth — attaches req.user if token present, continues either way.
 */
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    if (token) {
      const decoded = await verifyIdToken(token);
      req.user = {
        id: decoded.uid,
        email: decoded.email ?? '',
        name: decoded.name ?? '',
        picture: decoded.picture ?? '',
      };
    }
  } catch {
    // No valid token — continue unauthenticated
  }
  next();
};

module.exports = { authenticateToken, optionalAuth };
