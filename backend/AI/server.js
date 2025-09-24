// Mira AI AI - Simplified Refactored Server (without TensorFlow)
// Islamic AI Assistant for Vietnamese Muslim Community
// Developed by ABDOL HAMID

import express from 'express';
import cors from 'cors';
import NodeCache from 'node-cache';
// Load environment variables based on NODE_ENV
import dotenv from 'dotenv';

// Load appropriate .env file
const envFile = process.env.NODE_ENV === 'development' ? '.env.development' : '.env';
dotenv.config({ path: envFile });

console.log(`🔧 Loading environment from: ${envFile}`);

// Debug environment variables at startup
console.log('🔍 Environment Debug:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('GEMINI_API_KEY exists:', !!process.env.GEMINI_API_KEY);
console.log('All env keys:', Object.keys(process.env).filter(k => !k.startsWith('npm_')).sort());

// Import modular components
import { IslamicKnowledgeBase, rateLimitMap, userInteractionStats } from './islamicKnowledgeSystem.js';
import { checkRateLimit, detectQuestionContext } from './kiemTraVaXuLyCauHoi.js';
import { validateInput } from './kiemTraYeuCau.js';
import { processAPIRequest } from './xuLyAPI.js';

// Import database and AI
import { connectDatabase } from './database.js';
import { initializeGeminiAI, testGeminiConnection } from './geminiAI.js';
import { initializeAllData, startAnalyticsScheduler } from './dataPopulator.js';

// Import endpoint handlers
import { handleDebugInterface } from './endpoint/giaodienDebug.js';
import { handleIslamicKnowledge } from './endpoint/kienThucIslam.js';
import { handleHealthCheck } from './endpoint/sucKhoe.js';
import { handleIntelligentProcessor } from './endpoint/trinhThongMinh.js';

// Import utility modules
import { memorySystem } from './boNho.js';
import { deepLearningProcessor } from './hocSau.js';
import { helperFunctions } from './hamTroGiup.js';

// Server Configuration
const app = express();
const PORT = process.env.PORT || 8000;
const ALT_PORT = 3001;

// Initialize caching systems
const responseCache = new NodeCache({ stdTTL: 3600 }); // 1 hour TTL
const userContextCache = new NodeCache({ stdTTL: 86400 }); // 24 hours TTL

// Initialize Islamic Knowledge Base
const islamicKnowledgeBase = new IslamicKnowledgeBase();

// Simple learning system mock (without TensorFlow)
const simpleLearningSystem = {
  modelInitialized: false,
  
  async initializeDeepLearning() {
    console.log('🧠 Initializing simple learning system (no TensorFlow)...');
    this.modelInitialized = true;
    return true;
  },
  
  async learnFromResponse(question, response, references, context) {
    console.log('📚 Learning from response (simple mode)');
  }
};

// CORS Configuration - Enhanced for Production
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',           // Development frontend
      'http://localhost:3001',           // Alternative dev port
      'http://localhost:5173',           // Vite dev server
      'http://localhost:60835',
      'https://muslimviet.vercel.app',   // Production frontend
      'https://muslimviet-git-main-hamidabdol89s-projects.vercel.app', // Git branch
      'https://muslimviet-hamidabdol89s-projects.vercel.app', // User domain
      'https://muslimviet-preview.vercel.app', // Preview domains
    ];
    
    // Add origins from environment variable
    if (process.env.ALLOWED_ORIGINS) {
      const envOrigins = process.env.ALLOWED_ORIGINS.split(',');
      allowedOrigins.push(...envOrigins);
    }
    
    // Allow all Vercel preview domains and localhost
    if (origin.includes('.vercel.app') || 
        origin.includes('localhost') || 
        allowedOrigins.includes(origin)) {
      console.log('✅ CORS allowed origin:', origin);
      return callback(null, true);
    }
    
    console.log('🚫 CORS blocked origin:', origin);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'If-None-Match',
    'Cache-Control',
    'ETag',
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Origin',
    'Access-Control-Allow-Methods'
  ],
  exposedHeaders: ['ETag', 'Cache-Control'],
  optionsSuccessStatus: 200, // Changed from 204 to 200 for better compatibility
  preflightContinue: false
};

// Apply middleware
app.use(cors(corsOptions));

// Additional CORS headers for production
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Set CORS headers explicitly for all allowed origins
  if (origin && (origin.includes('.vercel.app') || 
                 origin.includes('localhost') ||
                 origin === 'https://muslimviet.vercel.app')) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    console.log('🌐 CORS headers set for origin:', origin);
  }
  
  // Set standard CORS headers
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, Cache-Control, If-None-Match');
  res.setHeader('Access-Control-Expose-Headers', 'ETag, Cache-Control');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    console.log('✅ CORS preflight handled for:', origin);
    res.setHeader('Access-Control-Max-Age', '86400'); // Cache preflight for 24 hours
    return res.status(200).end();
  }
  
  next();
});

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`\n[${new Date().toISOString()}] 📥 ${req.method} ${req.url}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('📦 Request body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// Explicit OPTIONS handler for preflight requests
app.options('*', cors(corsOptions));

// Initialize system components
async function initializeSystem() {
  try {
    console.log('🚀 Initializing Mira AI AI System...');
    
    // Connect to MongoDB
    await connectDatabase();
    console.log('✅ MongoDB connected');
    
    // Initialize Gemini AI
    await initializeGeminiAI();
    console.log('✅ Gemini AI initialized');
    
    // Test Gemini AI connection
    const geminiTest = await testGeminiConnection();
    if (geminiTest.success) {
      console.log('✅ Gemini AI connection tested successfully');
    } else {
      console.warn('⚠️ Gemini AI test failed:', geminiTest.error);
    }
    
    // Initialize Islamic Knowledge Base
    await islamicKnowledgeBase.initializeKnowledgeBase();
    console.log('✅ Islamic Knowledge Base initialized');

    // Initialize database with sample data
    await initializeAllData();
    console.log('✅ Database populated with initial data');

    console.log('🧠 Initializing simple learning system (no TensorFlow)...');
    // Simple learning system initialization
    console.log('✅ Simple Learning System initialized');
    
    // Initialize Memory System
    await memorySystem.initialize();
    console.log('✅ Memory System initialized');
    
    // Initialize Deep Learning Processor
    await deepLearningProcessor.initialize();
    console.log('✅ Deep Learning Processor initialized');
    
    console.log('🎉 All systems initialized successfully!');
    
    // Start analytics scheduler
    startAnalyticsScheduler();
    
  } catch (error) {
    console.error('❌ System initialization failed:', error);
    process.exit(1);
  }
}

// Main API endpoint for Islamic questions
app.post('/api/islamic-question', async (req, res) => {
  const startTime = Date.now();
  let clientIP = req.ip || req.connection.remoteAddress || 'unknown';
  
  try {
    console.log('\n🕌 Processing Islamic question...');
    
    const { question, userContext = {} } = req.body;
    
    // Rate limiting check
    if (!checkRateLimit(clientIP)) {
      return res.status(429).json({
        success: false,
        error: 'Bạn đã đặt quá nhiều câu hỏi trong thời gian ngắn. Vui lòng chờ một chút.',
        suggestion: 'Hãy dành thời gian suy ngẫm về câu trả lời trước đó.',
        retryAfter: 60
      });
    }
    
    // Input validation
    const validation = validateInput(question, clientIP, userContext);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: validation.error,
        suggestion: validation.suggestion,
        severity: validation.severity
      });
    }
    
    // Check cache for similar questions
    const cacheKey = `question_${Buffer.from(question).toString('base64').slice(0, 32)}`;
    const cachedResponse = responseCache.get(cacheKey);
    
    if (cachedResponse) {
      console.log('📋 Returning cached response');
      return res.json({
        success: true,
        response: cachedResponse.response,
        references: cachedResponse.references,
        cached: true,
        responseTime: Date.now() - startTime
      });
    }
    
    // Detect question context
    const questionContext = detectQuestionContext(question);
    questionContext.startTime = startTime; // Add start time for response time calculation
    console.log('🔍 Question context:', questionContext);
    
    // Process the question through AI system
    const aiResponse = await processAPIRequest({
      question: validation.processedQuestion,
      context: questionContext,
      userContext,
      clientIP,
      islamicKnowledgeBase,
      learningSystem: simpleLearningSystem,
      memorySystem
    });
    
    // Cache the response
    responseCache.set(cacheKey, {
      response: aiResponse.response,
      references: aiResponse.references,
      timestamp: Date.now()
    });
    
    // Learn from the interaction
    await simpleLearningSystem.learnFromResponse(
      question,
      aiResponse.response,
      aiResponse.references,
      questionContext
    );
    
    // Update Islamic knowledge base
    islamicKnowledgeBase.learnFromResponse(
      question,
      aiResponse.response,
      aiResponse.references,
      questionContext
    );
    
    const responseTime = Date.now() - startTime;
    console.log(`✅ Question processed successfully in ${responseTime}ms`);
    
    res.json({
      success: true,
      response: aiResponse.response,
      references: aiResponse.references,
      context: questionContext,
      responseTime,
      cached: false,
      model: aiResponse.model,
      provider: aiResponse.provider,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error processing Islamic question:', error);
    
    res.status(500).json({
      success: false,
      error: 'Đã xảy ra lỗi khi xử lý câu hỏi. Vui lòng thử lại sau.',
      suggestion: 'Nếu lỗi tiếp tục xảy ra, vui lòng liên hệ với quản trị viên.',
      responseTime: Date.now() - startTime
    });
  }
});

// Health check endpoint
app.get('/api/health', handleHealthCheck);

// Debug interface endpoint
app.get('/api/debug', handleDebugInterface);

// Islamic knowledge endpoint
app.get('/api/knowledge/:topic', handleIslamicKnowledge);

// Intelligent processor endpoint
app.post('/api/process', handleIntelligentProcessor);

// System statistics endpoint
app.get('/api/stats', (req, res) => {
  try {
    const stats = {
      server: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: process.version
      },
      cache: {
        responseCache: responseCache.getStats(),
        userContextCache: userContextCache.getStats()
      },
      rateLimiting: {
        activeUsers: rateLimitMap.size,
        totalInteractions: Array.from(userInteractionStats.values())
          .reduce((sum, stats) => sum + stats.totalRequests, 0)
      },
      islamicKnowledge: {
        quranReferences: islamicKnowledgeBase.quranReferences.size,
        hadithReferences: islamicKnowledgeBase.hadithReferences.size,
        commonQuestions: islamicKnowledgeBase.commonQuestions.size
      },
      timestamp: new Date().toISOString()
    };
    
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('❌ Error getting stats:', error);
    res.status(500).json({
      success: false,
      error: 'Không thể lấy thống kê hệ thống'
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Mira AI AI - Islamic Assistant for Vietnamese Muslim Community',
    version: '2.0.0-production',
    developer: 'ABDOL HAMID',
    status: 'active',
    features: {
      ai: 'Google Gemini 1.5 Flash',
      database: 'MongoDB Atlas',
      caching: 'NodeCache + MongoDB',
      authentication: 'JWT + Google OAuth',
      security: 'Advanced input validation + rate limiting'
    },
    endpoints: {
      main: '/api/islamic-question',
      health: '/api/health',
      debug: '/api/debug',
      knowledge: '/api/knowledge/:topic',
      process: '/api/process',
      stats: '/api/stats'
    },
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('🚨 Unhandled error:', error);
  
  res.status(500).json({
    success: false,
    error: 'Đã xảy ra lỗi hệ thống không mong muốn',
    suggestion: 'Vui lòng thử lại sau hoặc liên hệ với quản trị viên',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint không tồn tại',
    suggestion: 'Vui lòng kiểm tra lại URL hoặc tham khảo tài liệu API',
    availableEndpoints: [
      '/api/islamic-question',
      '/api/health',
      '/api/debug',
      '/api/knowledge/:topic',
      '/api/process',
      '/api/stats'
    ]
  });
});

// Start server
async function startServer() {
  try {
    // Initialize all systems first
    await initializeSystem();
    
    // Start the server
    const server = app.listen(PORT, () => {
      console.log(`\n🎉 Mira AI AI Server is running!`);
      console.log(`🌐 Main Server: http://localhost:${PORT}`);
      console.log(`🔧 Alternative Port: ${ALT_PORT}`);
      console.log(`📚 Islamic AI Assistant ready to serve the Vietnamese Muslim community`);
      console.log(`👨‍💻 Developed by ABDOL HAMID`);
      console.log(`⚙️  Mode: Simplified (no TensorFlow dependencies)`);
      console.log(`⏰ Started at: ${new Date().toISOString()}\n`);
    });
    
    // Set server timeout
    server.timeout = 30000; // 30 seconds
    
    // Try alternative port if main port fails
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.log(`⚠️  Port ${PORT} is busy, trying alternative port ${ALT_PORT}...`);
        
        const altServer = app.listen(ALT_PORT, () => {
          console.log(`🎉 Mira AI AI Server is running on alternative port!`);
          console.log(`🌐 Server: http://localhost:${ALT_PORT}`);
        });
      } else {
        console.error('❌ Server startup error:', error);
        process.exit(1);
      }
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Start the application
startServer().catch(error => {
  console.error('❌ Application startup failed:', error);
  process.exit(1);
});

export default app;
