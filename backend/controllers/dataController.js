const {collection, addDoc, getDocs, serverTimestamp } = require("firebase/firestore");
const statementModel = require('../models/statementModel');
const db = require('../firebase');

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
      const docRef = await addDoc(collection(db, 'statements'), {
        statement,
        result: {
          isMisinformation: isMisinformation,
          reasoning: reasoning,
          verifiedInfo: verifiedInfo,
        },
        createdAt: serverTimestamp(),
      });

      return { id: docRef.id, message: 'Statement saved successfully' };

    } catch (error) {
      console.error('Error saving statement:', error);
      res.status(500).json({ error: 'Failed to save statement' });
    }
  },

  async getStatements(req, res) {
    try {
      const snapshot = await getDocs(collection(db, 'statements'));
      const statements = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.status(200).json(statements);
    } catch (error) {
      console.error('Error fetching statements:', error);
      res.status(500).json({ error: 'Failed to fetch statements' });
    }
  },
};

module.exports = dataController;