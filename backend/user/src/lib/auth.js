const { betterAuth } = require('better-auth');
const { mongodbAdapter } = require('better-auth/adapters/mongodb');
const { MongoClient } = require('mongodb'); // top-level mongodb driver (bson 6.x)

let authInstance = null;
let mongoClient = null;

/**
 * Initialize Better Auth with its OWN MongoDB client.
 * Do NOT reuse mongoose connection — they use different bson versions.
 */
async function createAuth() {
  // Create a separate MongoClient for Better Auth
  // This avoids bson version conflict with mongoose's bundled mongodb
  mongoClient = new MongoClient(process.env.MONGODB_URI);
  await mongoClient.connect();

  const db = mongoClient.db();

  const extraOrigins = process.env.TRUSTED_ORIGINS
    ? process.env.TRUSTED_ORIGINS.split(',').map((o) => o.trim())
    : [];

  const trustedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'http://localhost:4173',
    ...extraOrigins,
  ].filter(Boolean);

  authInstance = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
    basePath: '/api/auth',
    secret: process.env.BETTER_AUTH_SECRET,
    trustedOrigins,
    database: mongodbAdapter(db),

    advanced: {
      crossSubdomainCookies: {
        enabled: false,
      },
      defaultCookieAttributes: {
        secure: true,
        httpOnly: true,
        sameSite: 'none',
        partitioned: true,
      },
      // After Google callback hits backend, redirect to frontend /api/auth proxy
      // This keeps the state cookie on the same domain as the initial request
      redirectProxyUrl: `${process.env.FRONTEND_URL}/api/auth`,
    },

    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
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

async function closeAuth() {
  if (mongoClient) await mongoClient.close();
}

module.exports = { createAuth, getAuth, closeAuth };
