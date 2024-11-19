const { collection, getDocs, doc, setDoc } = require("firebase/firestore");
const initializeFirebase = require("../firebase"); // Adjust the path to your Firebase setup
const { checkStatementWithGPT } = require("../services/gptService");

const apiController = {
  async fetchMpoxData(req, res) {
    try {
      const db = initializeFirebase(); // Get Firestore instance
      const response = await fetch(
        "https://tools.cdc.gov/api/v2/resources/media?topic=mpox"
      );
      const data = await response.json();
      const resources = data.results;

      const verifiedResources = await Promise.all(
        resources.map(async (resource) => {
          const source = resource.source.acronym;
          const title = resource.name;
          const description = resource.description;
          const contentUrl = resource.contentUrl;

          const contentResponse = await fetch(contentUrl);
          const content = await contentResponse.text();

          const resourceRef = doc(db, "mpoxResources", String(resource.id));
          const docSnapshot = await getDoc(resourceRef);

          let isMisinformation = null;
          let reasoning = null;
          let verifiedInfo = null;

          if (!docSnapshot.exists()) {
            const verificationData = await checkStatementWithGPT(title, content);
            isMisinformation = verificationData.isMisinformation;
            reasoning = verificationData.reasoning;
            verifiedInfo = verificationData.verifiedInfo;

            await setDoc(resourceRef, {
              source,
              title,
              description,
              content,
              dateFetched: new Date(),
              isMisinformation,
              reasoning,
              verifiedInfo,
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
        })
      );

      res.status(200).json({ resources: verifiedResources });
    } catch (error) {
      console.error("Error fetching mpox data:", error);
      res.status(500).json({ error: "Failed to fetch mpox data" });
    }
  },

  async compareStatement(req, res) {
    const { statement } = req.body;
    try {
      const db = initializeFirebase(); // Get Firestore instance
      const verifiedData = await fetchVerifiedDataFromFirestore(db);

      const MAX_VERIFIED_ITEMS = 25; // Limit the number of relevant items
      const relevantItems = identifyRelevantItems(statement, verifiedData).slice(
        0,
        MAX_VERIFIED_ITEMS
      );

      const formattedRelevantData = relevantItems
        .map(
          (item) => `
          Source: ${item.source}
          Title: ${item.title}
          Description: ${item.description}
          Content: ${item.content}
        `
        )
        .join("\n");

      const result = await checkStatementWithGPT(statement, formattedRelevantData);
      const { isMisinformation, reasoning, verifiedInfo } = parseGptResult(result);

      await this.saveStatement(
        { body: { statement, isMisinformation, reasoning, verifiedInfo } },
        res
      );

      res.status(200).json({ result });
    } catch (error) {
      console.error("Error comparing statement:", error);
      res.status(500).json({ error: "Failed to compare statement" });
    }
  },

  async saveStatement(req, res) {
    const { statement, isMisinformation, reasoning, verifiedInfo } = req.body;
    try {
      const db = initializeFirebase(); // Get Firestore instance
      const statementRef = doc(collection(db, "statements"), String(Date.now()));
      await setDoc(statementRef, {
        statement,
        isMisinformation,
        reasoning,
        verifiedInfo,
        dateSaved: new Date(),
      });

      res.status(200).json({ message: "Statement saved successfully" });
    } catch (error) {
      console.error("Error saving statement:", error);
      res.status(500).json({ error: "Failed to save statement" });
    }
  },

  async getStatements(req, res) {
    try {
      const db = initializeFirebase(); // Get Firestore instance
      const verifiedData = await fetchVerifiedDataFromFirestore(db);
      res.status(200).json({ statements: verifiedData });
    } catch (error) {
      console.error("Error fetching statements:", error);
      res.status(500).json({ error: "Failed to fetch statements" });
    }
  },
};

// Helper function to fetch verified data from Firestore
async function fetchVerifiedDataFromFirestore(db) {
  const verifiedData = [];
  const querySnapshot = await getDocs(collection(db, "mpoxResources"));
  querySnapshot.forEach((doc) => {
    verifiedData.push(doc.data());
  });
  return verifiedData;
}

// Function to identify relevant items using NLP
function identifyRelevantItems(statement, verifiedData) {
  return verifiedData.filter(
    (item) =>
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
