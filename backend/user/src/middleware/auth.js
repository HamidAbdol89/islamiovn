const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await User.findById(decoded.userId).select('-__v');
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token or user not found'
      });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

// Middleware to verify Google OAuth token
const authenticateGoogleToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    console.log('Auth middleware: Received token:', token ? 'exists' : 'missing');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Google access token required'
      });
    }

    console.log('Auth middleware: Verifying token with Google...');
    // Verify token with Google
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('Auth middleware: Google response status:', response.status);

    if (!response.ok) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Google token'
      });
    }

    const googleUser = await response.json();
    console.log('Auth middleware: Google user:', googleUser.email);
    
    // Find or create user
    let user = await User.findOne({ googleId: googleUser.id });
    
    if (!user) {
      console.log('Auth middleware: Creating new user');
      // Create new user
      user = new User({
        googleId: googleUser.id,
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.picture,
        verified_email: googleUser.verified_email
      });
      await user.save();
    } else {
      console.log('Auth middleware: Found existing user');
      // Update last login
      await user.updateLastLogin();
    }

    req.user = user;
    req.googleToken = token;
    next();
  } catch (error) {
    console.error('Google auth middleware error:', error);
    return res.status(401).json({
      success: false,
      message: 'Google authentication failed'
    });
  }
};

// Optional authentication (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-__v');
      
      if (user && user.isActive) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

module.exports = {
  authenticateToken,
  authenticateGoogleToken,
  optionalAuth
};
