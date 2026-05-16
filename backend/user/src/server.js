const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const http = require('http');
const { toNodeHandler } = require('better-auth/node');
const { createAuth, closeAuth } = require('./lib/auth');
const websocketService = require('./services/websocketService');
require('dotenv').config();

const app = express();

// ─── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  'https://islam.io.vn',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'cookie'],
  exposedHeaders: ['set-cookie'],
  optionsSuccessStatus: 200,
}));

// ─── Security & middleware ────────────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'development' ? 50000 : 200,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// ─── Health check (no auth needed) ───────────────────────────────────────────
// Returns 503 until DB is ready, 200 after bootstrap completes
let isReady = false;
app.get('/api/health', (req, res) => {
  if (!isReady) return res.status(503).json({ status: 'starting' });
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ─── Bootstrap: connect DB → init auth → start server ────────────────────────
async function bootstrap() {
  // 1. Connect MongoDB (mongoose for app models)
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/muslimviet');
  console.log('✅ Connected to MongoDB (mongoose)');

  // 2. Init Better Auth with its own MongoClient (avoids bson version conflict)
  const auth = await createAuth();

  // 3. Mount Better Auth handler BEFORE other routes
  //    Express 5 wildcard syntax: /api/auth/{*splat}
  app.all('/api/auth/{*splat}', toNodeHandler(auth.handler));
  console.log('✅ Better Auth mounted at /api/auth');

  // 4. App routes
  app.use('/api/users', require('./routes/users'));
  app.use('/api/bookmarks', require('./routes/bookmarks'));
  app.use('/api/favorites', require('./routes/favorites'));
  app.use('/api/masjid-favorites', require('./routes/masjidFavorites'));

  // 5. 404 & error handlers
  app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
  });
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
      success: false,
      message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
    });
  });

  // 6. Start HTTP server
  const PORT = process.env.PORT || 3000;
  const server = http.createServer(app);
  websocketService.initialize(server);

  server.listen(PORT, () => {
    isReady = true;
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
    console.log(`🔌 WebSocket: ws://localhost:${PORT}/favorites`);
  });

  const shutdown = (signal) => {
    console.log(`🛑 ${signal} — shutting down`);
    websocketService.close();
    closeAuth().catch(() => {});
    server.close(() => process.exit(0));
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  return server;
}

bootstrap().catch((err) => {
  console.error('❌ Bootstrap failed:', err);
  process.exit(1);
});

module.exports = { app };
