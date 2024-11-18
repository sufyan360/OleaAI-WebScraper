const { checkStatementWithGPT } = require('../services/gptService');
const dataController = require('./dataController');
const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;
const { getFirestore } = require('../firebase');

const compareController = {
  async compareStatement(req) {
    const { statement } = req.body;

    try {
      const verifiedData = await fetchVerifiedDataFromFirestore();
      const MAX_VERIFIED_ITEMS = 3;

      const relevantItems = identifyRelevantItems(statement, verifiedData).slice(0, MAX_VERIFIED_ITEMS);
      const formattedRelevantData = relevantItems.map(item => `
        Source: ${item.source}
        Title: ${item.title}
        Description: ${item.description}
        Content: ${item.content}
      `).join('\n');

      const gptResult = await checkStatementWithGPT(statement, formattedRelevantData);
      console.log("GPT RESULT: ", gptResult)

      const { isMisinformation, reasoning, verifiedInfo } = parseGptResult(gptResult);
      
      return { statement, isMisinformation, reasoning, verifiedInfo };
    } catch (error) {
      console.error('Error comparing statement:', error.message);
      throw new Error('Failed to compare statement');
    }
  },
};

// Function to fetch verified data from Firestore
async function fetchVerifiedDataFromFirestore() {
  const verifiedData = [];
  const db = await getFirestore();
  
  const querySnapshot = await db.collection('mpoxResources').get();
  querySnapshot.forEach((doc) => {
    verifiedData.push(doc.data()); 
  });
  return verifiedData;
}

// NLP function to identify relevant items based on token similarity
function identifyRelevantItems(statement, verifiedData) {
  const statementTokens = tokenizer.tokenize(statement).map(token => stemmer.stem(token.toLowerCase()));
  const relevantItems = [];

  verifiedData.forEach(item => {
    try {
      const itemText = `${item.title} ${item.description} ${item.content}`;
      const itemTokens = tokenizer.tokenize(itemText).map(token => stemmer.stem(token.toLowerCase()));
      const similarityScore = calculateSimilarity(statementTokens, itemTokens);
      
      const similarityThreshold = 0.02;
      if (similarityScore >= similarityThreshold) {
        relevantItems.push({ item, similarityScore }); 
      }
    } catch (error) {
      console.error(`Error processing item ${item.title}:`, error);
    }
  });

  relevantItems.sort((a, b) => b.similarityScore - a.similarityScore);
  return relevantItems.map(entry => entry.item);
}

// Function to calculate similarity using Jaccard index
function calculateSimilarity(tokens1, tokens2) {
  const set1 = new Set(tokens1);
  const set2 = new Set(tokens2);
  const intersection = new Set([...set1].filter(token => set2.has(token))).size;
  const union = new Set([...set1, ...set2]).size;
  return intersection / union;
}

// Function to parse the GPT result
function parseGptResult(result) {
  let output = {
    isMisinformation: null,
    reasoning: null,
    verifiedInfo: null,
  };

  try {
    const parsedData = JSON.parse(result);

    output.isMisinformation = parsedData.isMisinformation;
    output.reasoning = parsedData.reasoning;
    output.verifiedInfo = parsedData.verifiedInfo;

  } catch (error) {
    console.error('Error parsing GPT result using JSON:', error);

    // Use regex as a fallback to extract the necessary information
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
