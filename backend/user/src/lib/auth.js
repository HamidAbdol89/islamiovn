const { betterAuth } = require('better-auth');
const { mongodbAdapter } = require('better-auth/adapters/mongodb');

let authInstance = null;

/**
 * Initialize Better Auth with MongoDB.
 * Must be called after mongoose connects so we can reuse its connection.
 *
 * Better Auth terminology:
 *   baseURL   = URL of THIS backend server (Auth Server)
 *   basePath  = path where auth routes are mounted (default: /api/auth)
 *   trustedOrigins = frontend URLs allowed to make cross-origin requests
 *
 * @param {import('mongoose')} mongoose - connected mongoose instance
 */
function createAuth(mongoose) {
  const client = mongoose.connection.getClient();
  const db = client.db();

  // Build trusted origins from env — supports comma-separated list
  const extraOrigins = process.env.TRUSTED_ORIGINS
    ? process.env.TRUSTED_ORIGINS.split(',').map((o) => o.trim())
    : [];

  const trustedOrigins = [
    process.env.FRONTEND_URL,   // https://islam.io.vn
    'http://localhost:5173',    // local dev
    'http://localhost:4173',    // vite preview
    ...extraOrigins,
  ].filter(Boolean);

  authInstance = betterAuth({
    // ── Server identity ──────────────────────────────────────────────────────
    // URL of this backend (Auth Server) — e.g. https://islamiovn-api.onrender.com
    baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',

    // Path where Better Auth handler is mounted in Express
    // Must match the app.all() path in server.js
    basePath: '/api/auth',

    // ── Security ──────────────────────────────────────────────────────────────
    secret: process.env.BETTER_AUTH_SECRET,
    trustedOrigins,

    // ── Database ──────────────────────────────────────────────────────────────
    database: mongodbAdapter(db),
    // Better Auth auto-creates collections: user, session, account, verification

    // ── Social providers ──────────────────────────────────────────────────────
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        // Google will redirect to: {baseURL}{basePath}/callback/google
        // = https://islamiovn-api.onrender.com/api/auth/callback/google
        // → Register this exact URL in Google Cloud Console
      },
    },
  });

  return authInstance;
}

function getAuth() {
  if (!authInstance) {
    throw new Error('Better Auth not initialized. Call createAuth() first.');
  }
  return authInstance;
}

module.exports = { createAuth, getAuth };
