import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { promises as fs } from 'fs';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  const serviceAccount = JSON.parse(await fs.readFile(serviceAccountPath, 'utf8'));

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = getFirestore();  // Firestore instance for the Admin SDK

export { db };
