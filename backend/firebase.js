const admin = require('firebase-admin');
const fs = require('fs').promises;
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;  // Make sure this path is correct

let initialized = false;

async function initializeFirebase() {
  if (!initialized) {
    try {
      const serviceAccount = JSON.parse(await fs.readFile(serviceAccountPath, 'utf8'));
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL,
      });
      initialized = true;
      console.log("Firebase App Initialized");
    } catch (error) {
      console.error("Error initializing Firebase:", error);
    }
  } else {
    console.log("Firebase App already initialized");
  }
}

async function getFirestore() {
  await initializeFirebase();
  return admin.firestore();  
}

module.exports = { getFirestore };
