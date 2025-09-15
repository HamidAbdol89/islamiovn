const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// Verify JWT token
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// Generate refresh token
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId, type: 'refresh' },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// Success response helper
const successResponse = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

// Error response helper
const errorResponse = (res, message = 'Error', statusCode = 400, error = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(error && process.env.NODE_ENV === 'development' && { error })
  });
};

// Validation error response
const validationErrorResponse = (res, errors) => {
  return res.status(400).json({
    success: false,
    message: 'Validation failed',
    errors
  });
};

// Pagination helper
const paginate = (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  return { skip, limit };
};

// Format pagination response
const formatPaginationResponse = (data, page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    data,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: total,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  };
};

// Sanitize user data
const sanitizeUser = (user) => {
  const userObj = user.toObject ? user.toObject() : user;
  delete userObj.__v;
  return userObj;
};

// Generate random string
const generateRandomString = (length = 10) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Validate email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate ObjectId
const isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

module.exports = {
  generateToken,
  verifyToken,
  generateRefreshToken,
  successResponse,
  errorResponse,
  validationErrorResponse,
  paginate,
  formatPaginationResponse,
  sanitizeUser,
  generateRandomString,
  isValidEmail,
  isValidObjectId
};
