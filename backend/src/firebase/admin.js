const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

let db = null;
let initialized = false;

function initFirebase() {
  if (initialized) return db;

  // Method 1: Service account JSON file path from .env
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

  // Method 2: Inline JSON string from .env (for deployment)
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  try {
    if (!admin.apps.length) {
      let credential;

      if (serviceAccountPath) {
        const absolutePath = path.isAbsolute(serviceAccountPath)
          ? serviceAccountPath
          : path.join(__dirname, '../../', serviceAccountPath);

        if (fs.existsSync(absolutePath)) {
          const serviceAccount = JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
          credential = admin.credential.cert(serviceAccount);
          console.log('[Firebase] Initialized with service account file ✅');
        } else {
          console.warn(`[Firebase] Service account file not found at: ${absolutePath}`);
          return null;
        }
      } else if (serviceAccountJson) {
        const serviceAccount = JSON.parse(serviceAccountJson);
        credential = admin.credential.cert(serviceAccount);
        console.log('[Firebase] Initialized with service account JSON ✅');
      } else {
        console.warn('[Firebase] No Firebase credentials found in .env — using mock data');
        return null;
      }

      admin.initializeApp({
        credential,
        databaseURL: process.env.FIREBASE_DATABASE_URL,
      });
    }

    db = admin.firestore();
    initialized = true;
    return db;
  } catch (err) {
    console.error('[Firebase] Init error:', err.message);
    return null;
  }
}

module.exports = { initFirebase, getDb: () => db || initFirebase() };
