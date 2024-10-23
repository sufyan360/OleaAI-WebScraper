const statementModel = require('../models/statementModel');
const { getFirestore } = require('../firebase');
const admin = require('firebase-admin');
const { FieldValue } = admin.firestore; // Importing FieldValue to use serverTimestamp


const dataController = {
  
  async saveStatement(req, res) {

    if (!req.body) {
      return res.status(400).json({ error: 'Request body is missing' });
    }

    const { statement, isMisinformation, reasoning, verifiedInfo} = req.body;

    if (!statement || isMisinformation === undefined || !reasoning || !verifiedInfo) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }

    try {
      const db = await getFirestore();
      const docRef = await db.collection('mpoxResources').add({
        statement,
        result: {
          isMisinformation: isMisinformation,
          reasoning: reasoning,
          verifiedInfo: verifiedInfo,
        },
        createdAt: FieldValue.serverTimestamp(),
      });

      return { id: docRef.id, message: 'Statement saved successfully' };

    } catch (error) {
      console.error('Error saving statement:', error);
      res.status(500).json({ error: 'Failed to save statement' });
    }
  },

  async getStatements(req, res) {
    const db = await getFirestore();
    try {
      const snapshot = await db.collection('statements').get();
      const statements = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.status(200).json(statements);
    } catch (error) {
      console.error('Error fetching statements:', error);
      res.status(500).json({ error: 'Failed to fetch statements' });
    }
  },
};

module.exports = dataController;