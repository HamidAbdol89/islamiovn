const { getAuth } = require('../lib/auth');

/**
 * Require a valid Better Auth session.
 * Attaches req.user (Better Auth user object) and req.session.
 */
const authenticateToken = async (req, res, next) => {
  try {
    const auth = getAuth();
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session?.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    req.user = session.user;
    req.session = session.session;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      success: false,
      message: 'Authentication failed',
    });
  }
};

/**
 * Optional authentication — attaches req.user if session exists, continues either way.
 */
const optionalAuth = async (req, res, next) => {
  try {
    const auth = getAuth();
    const session = await auth.api.getSession({ headers: req.headers });

    if (session?.user) {
      req.user = session.user;
      req.session = session.session;
    }
  } catch {
    // No session — continue unauthenticated
  }
  next();
};

module.exports = { authenticateToken, optionalAuth };
