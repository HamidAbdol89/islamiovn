const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  userId: {
    type: String,   // Better Auth user ID (string, not ObjectId)
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: ['hadith', 'quran', 'dua', 'tasbih'],
    required: true
  },
  itemId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  metadata: {
    // For Hadith
    hadithNumber: String,
    narrator: String,
    source: String,
    category: String,
    
    // For Quran
    surahNumber: Number,
    surahName: String,
    verseNumber: Number,
    juzNumber: Number,
    
    // For Dua
    duaCategory: String,
    
    // For Tasbih
    tasbihCount: Number,
    tasbihType: String
  },
  tags: [{
    type: String,
    trim: true
  }],
  notes: {
    type: String,
    maxlength: 1000
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  viewCount: {
    type: Number,
    default: 0
  },
  lastViewed: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound indexes for better performance
bookmarkSchema.index({ userId: 1, type: 1 });
bookmarkSchema.index({ userId: 1, itemId: 1 });
bookmarkSchema.index({ userId: 1, createdAt: -1 });
bookmarkSchema.index({ type: 1, isPublic: 1 });

// Method to increment view count
bookmarkSchema.methods.incrementView = function() {
  this.viewCount += 1;
  this.lastViewed = new Date();
  return this.save();
};


// Remove populate reference since userId is now a plain string
bookmarkSchema.statics.getUserBookmarks = function(userId, type, options = {}) {
  const query = { userId };
  if (type) query.type = type;
  
  const limit = options.limit || 20;
  const skip = options.skip || 0;
  const sort = options.sort || { createdAt: -1 };
  
  return this.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit);
};

// Static method to get popular bookmarks
bookmarkSchema.statics.getPopularBookmarks = function(type, limit = 10) {
  return this.find({ 
    type, 
    isPublic: true 
  })
    .sort({ viewCount: -1 })
    .limit(limit);
};

module.exports = mongoose.model('Bookmark', bookmarkSchema);
