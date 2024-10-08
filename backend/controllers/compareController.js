const { checkStatementWithGPT } = require('../services/gptService');
const dataController = require('./dataController');
const {collection, getDocs } = require("firebase/firestore");
const { getFirestore } = require('../firebase');
const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;

const compareController = {
  async compareStatement(req, res) {
    const db = await getFirestore();
    const { statement } = req.body;

    try {
      const verifiedData = await fetchVerifiedDataFromFirestore();

      const MAX_VERIFIED_ITEMS = 5; // Limit the number of relevant items

      const relevantItems = identifyRelevantItems(statement, verifiedData).slice(0, MAX_VERIFIED_ITEMS);

      const formattedRelevantData = relevantItems.map(item => `
        Source: ${item.source}
        Title: ${item.title}
        Description: ${item.description}
        Content: ${item.content}
      `).join('\n');

      const result =await checkStatementWithGPT(statement, formattedRelevantData);

      const { isMisinformation, reasoning, verifiedInfo } = parseGptResult(result);


      await dataController.saveStatement({ body: { statement, isMisinformation, reasoning, verifiedInfo } }, res);

      res.status(200).json({ result });
    } catch (error) {
      console.error('Error comparing statement:', error);
      res.status(500).json({ error: 'Failed to compare statement' });
    }
  },
};

async function fetchVerifiedDataFromFirestore() {
  const verifiedData = [];
  const querySnapshot = await getDocs(collection(db, 'mpoxResources'));
  querySnapshot.forEach((doc) => {
    verifiedData.push(doc.data()); 
  });
  return verifiedData;
}

// Function to identify relevant items using NLP
function identifyRelevantItems(statement, verifiedData) {
  
  // Tokenize and stem the statement
  const statementTokens = tokenizer.tokenize(statement).map(token => stemmer.stem(token.toLowerCase()));

  // Array to hold relevant items
  const relevantItems = [];

  verifiedData.forEach(item => {
  try {
    // Combine item title and description for comparison
    const itemText = `${item.title} ${item.description} ${item.content}`; 
    const itemTokens = tokenizer.tokenize(itemText).map(token => stemmer.stem(token.toLowerCase()));

    // Calculate similarity
    const similarityScore = calculateSimilarity(statementTokens, itemTokens);

    // Define a threshold for relevance (e.g., 0.2)
    const similarityThreshold = 0.02;

    // If similarity score exceeds the threshold, consider it relevant
    if (similarityScore >= similarityThreshold) {
      relevantItems.push({ item, similarityScore }); 
    }
  } catch (error) {
      console.error(`Error processing item ${item.title}:`, error);
  }
  });
  relevantItems.sort((a, b) => b.similarityScore - a.similarityScore);

  // Return only the items without their scores
  return relevantItems.map(entry => entry.item);
}

// Function to calculate similarity score based on Jaccard index
function calculateSimilarity(tokens1, tokens2) {
  const set1 = new Set(tokens1);
  const set2 = new Set(tokens2);

  const intersection = new Set([...set1].filter(token => set2.has(token))).size;
  const union = new Set([...set1, ...set2]).size;

  // Calculate Jaccard similarity score
  return intersection / union;
}

function parseGptResult(result) {
  let output = {
    isMisinformation: null,
    reasoning: null,
    verifiedInfo: null,
  };

  try {
    parsedData = JSON.parse(result);

    output.isMisinformation = parsedData.isMisinformation;
    output.reasoning = parsedData.reasoning;
    output.verifiedInfo = parsedData.verifiedInfo;

  } catch (error) {
    console.error('Error parsing GPT result using JSON:', error);

    // Using regex to extract information
    // Fallback if json parsing fails
    const flagMatch = result.match(/isMisinformation:\s*(True|False)/i);
    const reasoningMatch = result.match(/reasoning:\s*([^\n]*)/i);
    const verifiedInfoMatch = result.match(/verifiedInfo:\s*([^\n]*)/i);

    output.isMisinformation = flagMatch ? flagMatch[1].toLowerCase() === 'true' : null;
    output.reasoning = reasoningMatch ? reasoningMatch[1].trim() : null;
    output.verifiedInfo = verifiedInfoMatch ? verifiedInfoMatch[1].trim() : null;
  }

  return output;
}


module.exports = compareController;