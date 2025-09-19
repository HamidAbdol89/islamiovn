// database.js - MongoDB Connection và Models
import mongoose from 'mongoose';

// MongoDB Connection
export async function connectDatabase() {
  try {
    // Debug environment variables
    console.log('🔍 Checking environment variables...');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('Available env vars:', Object.keys(process.env).filter(key => key.includes('MONGO')));
    
    let mongoURI = process.env.MONGODB_URI;
    console.log('MONGODB_URI exists:', !!mongoURI);
    console.log('MONGODB_URI length:', mongoURI ? mongoURI.length : 0);
    
    // Fallback for Fly.io secrets issue
    if (!mongoURI) {
      console.log('🔄 Trying alternative env var names...');
      mongoURI = process.env.DATABASE_URL || process.env.MONGO_URL;
      console.log('Alternative URI found:', !!mongoURI);
    }
    
    if (!mongoURI) {
      console.log('❌ All environment variable attempts failed');
      console.log('Available env vars:', Object.keys(process.env).filter(k => k.includes('MONGO') || k.includes('DATABASE')));
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB connected successfully');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    throw error;
  }
}

// User Schema cho authentication
const userSchema = new mongoose.Schema({
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
  avatar: String,
  googleId: String,
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  preferences: {
    language: {
      type: String,
      default: 'vi'
    },
    notifications: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true
});

// Islamic Question Schema
const islamicQuestionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow anonymous questions
  },
  question: {
    type: String,
    required: true,
    maxlength: 2000
  },
  response: {
    type: String,
    required: true
  },
  context: {
    emotionalState: String,
    urgencyLevel: String,
    complexityLevel: String,
    culturalContext: String,
    detectedTopics: [String]
  },
  references: [{
    type: {
      type: String,
      enum: ['quran', 'hadith', 'scholarly', 'contemporary']
    },
    citation: String,
    source: String
  }],
  userIP: String,
  responseTime: Number,
  satisfaction: {
    rating: Number,
    feedback: String
  },
  isPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Islamic Knowledge Base Schema
const islamicKnowledgeSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  references: [{
    source: String,
    citation: String,
    type: {
      type: String,
      enum: ['quran', 'hadith', 'scholarly', 'contemporary']
    }
  }],
  tags: [String],
  language: {
    type: String,
    default: 'vi'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verifiedBy: String,
  usage: {
    viewCount: {
      type: Number,
      default: 0
    },
    helpfulCount: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// User Interaction Stats Schema
const userStatsSchema = new mongoose.Schema({
  identifier: {
    type: String,
    required: true,
    unique: true // IP hoặc User ID
  },
  totalQuestions: {
    type: Number,
    default: 0
  },
  totalResponseTime: {
    type: Number,
    default: 0
  },
  avgResponseTime: {
    type: Number,
    default: 0
  },
  topicsInterested: [{
    topic: String,
    count: Number
  }],
  emotionHistory: [{
    emotion: String,
    confidence: Number,
    timestamp: Date
  }],
  satisfactionRatings: [{
    rating: Number,
    timestamp: Date
  }],
  firstSeen: {
    type: Date,
    default: Date.now
  },
  lastSeen: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// System Analytics Schema
const analyticsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true
  },
  metrics: {
    totalQuestions: Number,
    uniqueUsers: Number,
    avgResponseTime: Number,
    topTopics: [{
      topic: String,
      count: Number
    }],
    satisfactionAvg: Number,
    errorRate: Number
  },
  performance: {
    serverUptime: Number,
    memoryUsage: Number,
    cacheHitRate: Number
  }
}, {
  timestamps: true
});

// Export Models
export const User = mongoose.model('User', userSchema);
export const IslamicQuestion = mongoose.model('IslamicQuestion', islamicQuestionSchema);
export const IslamicKnowledge = mongoose.model('IslamicKnowledge', islamicKnowledgeSchema);
export const UserStats = mongoose.model('UserStats', userStatsSchema);
export const Analytics = mongoose.model('Analytics', analyticsSchema);

// Helper Functions
export async function saveQuestion(questionData) {
  try {
    const question = new IslamicQuestion(questionData);
    await question.save();
    return question;
  } catch (error) {
    console.error('Error saving question:', error);
    throw error;
  }
}

export async function updateUserStats(identifier, questionData) {
  try {
    const stats = await UserStats.findOneAndUpdate(
      { identifier },
      {
        $inc: { 
          totalQuestions: 1,
          totalResponseTime: questionData.responseTime || 0
        },
        $set: { 
          lastSeen: new Date(),
          avgResponseTime: 0 // Will be calculated
        },
        $addToSet: {
          topicsInterested: {
            $each: questionData.context?.detectedTopics?.map(topic => ({
              topic,
              count: 1
            })) || []
          }
        }
      },
      { 
        upsert: true, 
        new: true,
        setDefaultsOnInsert: true
      }
    );

    // Calculate average response time
    if (stats.totalQuestions > 0) {
      stats.avgResponseTime = stats.totalResponseTime / stats.totalQuestions;
      await stats.save();
    }

    return stats;
  } catch (error) {
    console.error('Error updating user stats:', error);
    throw error;
  }
}

export async function getIslamicKnowledge(topic) {
  try {
    const knowledge = await IslamicKnowledge.findOne({ 
      topic: new RegExp(topic, 'i'),
      isVerified: true 
    });
    
    if (knowledge) {
      // Increment view count
      knowledge.usage.viewCount += 1;
      await knowledge.save();
    }
    
    return knowledge;
  } catch (error) {
    console.error('Error getting Islamic knowledge:', error);
    return null;
  }
}
