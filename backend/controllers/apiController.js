const axios = require('axios');
const { getFirestore } = require('../firebase'); 
const { checkStatementWithGPT } = require('../services/gptService');

const apiController = {
  async fetchMpoxData(req, res) {
    console.log('Fetching mpox data...');
    try {
      // Initialize Firestore instance
      const db = await getFirestore(); // Await the Firestore instance from the Admin SDK

      // Fetch resource metadata from CDC API
      const response = await axios.get('https://tools.cdc.gov/api/v2/resources/media?topic=mpox');
      const resources = response.data.results;
      console.log('API response:', resources[1]?.source?.acronym);

      // Process each resource
      const verifiedResources = await Promise.all(resources.map(async (resource) => {
        const source = resource.source.acronym;
        const title = resource.name;
        const description = resource.description;
        const contentUrl = resource.contentUrl;

        // Scrape the content from the content URL
        const contentResponse = await axios.get(contentUrl);
        const content = contentResponse.data;

        // Check if resource already exists in Firestore
        const resourceRef = db.collection('mpoxResources').doc(String(resource.id)); // Use Admin SDK methods
        const docSnapshot = await resourceRef.get();
        console.log("Checked if resource exists");

        let isMisinformation = null;
        let reasoning = null;
        let verifiedInfo = null;

        if (!docSnapshot.exists) {
          const verificationData = await checkStatementWithGPT(title, content);
          isMisinformation = verificationData.isMisinformation;
          reasoning = verificationData.reasoning;
          verifiedInfo = verificationData.verifiedInfo;

          // Add new resource to Firestore
          await resourceRef.set({
            source,
            title,
            description,
            content,
            dateFetched: new Date(),
            isMisinformation,
            reasoning,
            verifiedInfo,
          });
        } else {
          // Update existing resource if needed
          await resourceRef.update({
            source,
            title,
            description,
            content,
            dateFetched: new Date(),
          });
        }

        return {
          source,
          title,
          description,
          content,
          isMisinformation,
          reasoning,
          verifiedInfo,
        };
      }));

      res.status(200).json({ resources: verifiedResources });
    } catch (error) {
      console.error('Error fetching mpox data:', error);
      res.status(500).json({ error: 'Failed to fetch mpox data' });
    }
  },

  async compareStatement(req, res) {
    const { statement } = req.body;

    try {
      const db = await getFirestore(); 
      const verifiedData = await fetchVerifiedDataFromFirestore(db);

      const MAX_VERIFIED_ITEMS = 25; // Adjust as necessary

      const relevantItems = identifyRelevantItems(statement, verifiedData).slice(0, MAX_VERIFIED_ITEMS);

      const formattedRelevantData = relevantItems.map(item => `
        Source: ${item.source}
        Title: ${item.title}
        Description: ${item.description}
        Content: ${item.content}
      `).join('\n');

      const result = await checkStatementWithGPT(statement, formattedRelevantData);
      const { isMisinformation, reasoning, verifiedInfo } = parseGptResult(result);

      // Save the statement after comparison
      await this.saveStatement({ body: { statement, isMisinformation, reasoning, verifiedInfo } }, res);

      res.status(200).json({ result });
    } catch (error) {
      console.error('Error comparing statement:', error);
      res.status(500).json({ error: 'Failed to compare statement' });
    }
  },

  async saveStatement(req, res) {
    const { statement, isMisinformation, reasoning, verifiedInfo } = req.body;

    try {
      const db = await getFirestore(); // Initialize Firestore instance
      const statementRef = doc(collection(db, 'statements'), String(Date.now())); // Use a timestamp as the document ID
      await setDoc(statementRef, {
        statement,
        isMisinformation,
        reasoning,
        verifiedInfo,
        dateSaved: new Date(),
      });

      res.status(200).json({ message: 'Statement saved successfully' });
    } catch (error) {
      console.error('Error saving statement:', error);
      res.status(500).json({ error: 'Failed to save statement' });
    }
  },

  async getStatements(req, res) {
    try {
      const db = await getFirestore(); // Initialize Firestore instance
      const verifiedData = await fetchVerifiedDataFromFirestore(db);
      res.status(200).json({ statements: verifiedData });
    } catch (error) {
      console.error('Error fetching statements:', error);
      res.status(500).json({ error: 'Failed to fetch statements' });
    }
  },
};

// Helper function to fetch verified data from Firestore
async function fetchVerifiedDataFromFirestore(db) {
  const verifiedData = [];
  const querySnapshot = await getDocs(collection(db, 'mpoxResources'));
  querySnapshot.forEach((doc) => {
    verifiedData.push(doc.data());
  });
  return verifiedData;
}

// Function to identify relevant items using NLP
function identifyRelevantItems(statement, verifiedData) {
  return verifiedData.filter(item => 
    item.title.includes(statement) || item.description.includes(statement)
  );
}

// Function to parse the GPT result
function parseGptResult(result) {
  return {
    isMisinformation: result.isMisinformation,
    reasoning: result.reasoning,
    verifiedInfo: result.verifiedInfo,
  };
}

module.exports = apiController;
