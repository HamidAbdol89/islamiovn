const mongoose = require('mongoose');

const masjidFavoriteSchema = new mongoose.Schema({
  userId: {
    type: String,   // Better Auth user ID (string, not ObjectId)
    required: true,
    index: true,
  },
  masjidId: {
    type: String,
    required: true,
    trim: true
  },
  masjidName: {
    type: String,
    required: true,
    trim: true
  },
  masjidCity: {
    type: String,
    required: true,
    trim: true
  },
  masjidRegion: {
    type: String,
    required: true,
    enum: ['Miền Bắc', 'Miền Trung', 'Miền Nam'],
    trim: true
  },
  masjidAddress: {
    type: String,
    trim: true
  },
  masjidImage: {
    type: String,
    trim: true
  },
  // User's personal note about this masjid
  personalNote: {
    type: String,
    maxlength: 500,
    trim: true
  },
  // Whether this favorite is public (visible to others)
  isPublic: {
    type: Boolean,
    default: true
  },
  // Visit status
  hasVisited: {
    type: Boolean,
    default: false
  },
  visitDate: {
    type: Date
  },
  // Rating (1-5 stars)
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  // Tags for categorization
  tags: [{
    type: String,
    trim: true,
    enum: ['đã_thăm', 'muốn_thăm', 'gần_nhà', 'đẹp', 'yên_tĩnh', 'tiện_lợi', 'lịch_sử']
  }],
  // Metadata
  lastViewed: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound indexes for better performance
masjidFavoriteSchema.index({ userId: 1, masjidId: 1 }, { unique: true });
masjidFavoriteSchema.index({ masjidId: 1, isPublic: 1 });
masjidFavoriteSchema.index({ userId: 1, createdAt: -1 });
masjidFavoriteSchema.index({ masjidRegion: 1, isPublic: 1 });
masjidFavoriteSchema.index({ hasVisited: 1, isPublic: 1 });
masjidFavoriteSchema.index({ rating: -1, isPublic: 1 });

// Method to update last viewed
masjidFavoriteSchema.methods.updateLastViewed = function() {
  this.lastViewed = new Date();
  return this.save();
};

// Static method to get users who favorited a specific masjid
masjidFavoriteSchema.statics.getUsersWhoFavorited = function(masjidId, options = {}) {
  const limit = options.limit || 10;
  
  return this.find({ 
    masjidId, 
    isPublic: true 
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('userId createdAt hasVisited rating');
};

// Static method to get user's favorite masjids
masjidFavoriteSchema.statics.getUserFavorites = function(userId, options = {}) {
  const limit = options.limit || 20;
  const skip = options.skip || 0;
  const region = options.region;
  const hasVisited = options.hasVisited;
  
  const query = { userId };
  if (region && region !== 'Tất cả') query.masjidRegion = region;
  if (typeof hasVisited === 'boolean') query.hasVisited = hasVisited;
  
  return this.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('userId', 'name picture');
};

// Static method to get popular masjids (most favorited)
masjidFavoriteSchema.statics.getPopularMasjids = function(options = {}) {
  const limit = options.limit || 10;
  const region = options.region;
  
  const matchStage = { isPublic: true };
  if (region && region !== 'Tất cả') matchStage.masjidRegion = region;
  
  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$masjidId',
        masjidName: { $first: '$masjidName' },
        masjidCity: { $first: '$masjidCity' },
        masjidRegion: { $first: '$masjidRegion' },
        masjidAddress: { $first: '$masjidAddress' },
        masjidImage: { $first: '$masjidImage' },
        favoriteCount: { $sum: 1 },
        averageRating: { $avg: '$rating' },
        visitedCount: { $sum: { $cond: ['$hasVisited', 1, 0] } },
        latestFavorite: { $max: '$createdAt' }
      }
    },
    { $sort: { favoriteCount: -1, latestFavorite: -1 } },
    { $limit: limit }
  ]);
};

// Static method to get masjid statistics
masjidFavoriteSchema.statics.getMasjidStats = function(masjidId) {
  return this.aggregate([
    { $match: { masjidId, isPublic: true } },
    {
      $group: {
        _id: '$masjidId',
        totalFavorites: { $sum: 1 },
        averageRating: { $avg: '$rating' },
        visitedCount: { $sum: { $cond: ['$hasVisited', 1, 0] } },
        ratingDistribution: {
          $push: {
            $cond: [
              { $ne: ['$rating', null] },
              '$rating',
              '$$REMOVE'
            ]
          }
        }
      }
    }
  ]);
};

// Static method to check if user has favorited a masjid
masjidFavoriteSchema.statics.isUserFavorited = function(userId, masjidId) {
  return this.findOne({ userId, masjidId }).select('_id');
};

module.exports = mongoose.model('MasjidFavorite', masjidFavoriteSchema);
