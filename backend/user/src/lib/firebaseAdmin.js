const admin = require('firebase-admin');

let initialized = false;

function initFirebaseAdmin() {
  if (initialized) return;

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Railway env vars preserve newlines if set correctly
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });

  initialized = true;
}

async function verifyIdToken(idToken) {
  initFirebaseAdmin();
  return admin.auth().verifyIdToken(idToken);
}

module.exports = { verifyIdToken };
