const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  name: {
    type: String,
    required: true
  },
  picture: {
    type: String,
    default: ''
  },
  verified_email: {
    type: Boolean,
    default: false
  },
  preferences: {
    language: {
      type: String,
      default: 'vi'
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'auto'
    },
    notifications: {
      prayerTimes: {
        type: Boolean,
        default: true
      },
      quranReminder: {
        type: Boolean,
        default: true
      },
      hadithDaily: {
        type: Boolean,
        default: true
      }
    }
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better performance
userSchema.index({ googleId: 1 });
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });

// Virtual for user stats
userSchema.virtual('stats', {
  ref: 'Bookmark',
  localField: '_id',
  foreignField: 'userId',
  count: true
});

// Method to update last login
userSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save();
};

// Method to get user profile (without sensitive data)
userSchema.methods.getProfile = function() {
  const userObject = this.toObject();
  return {
    id: userObject._id,
    googleId: userObject.googleId,
    email: userObject.email,
    name: userObject.name,
    picture: userObject.picture,
    verified_email: userObject.verified_email,
    preferences: userObject.preferences,
    lastLogin: userObject.lastLogin,
    createdAt: userObject.createdAt
  };
};

module.exports = mongoose.model('User', userSchema);
