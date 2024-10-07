// backend/firebase.js
import admin from 'firebase-admin';

// Check if Firebase Admin has already been initialized
if (!admin.apps.length) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY); // Load from env
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL,  // Ensure you have this in your .env file
    });
}

const db = admin.firestore();  // Get Firestore instance

export { db };
