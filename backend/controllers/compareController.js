const { checkStatementWithGPT } = require('../services/gptService');
const { getFirestore } = require('../firebase');
const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;

const compareController = {
  async compareStatement(req, res) {
    const { statement } = req.body;

    try {
      console.log('Comparing statement:', statement); // Log the statement being compared

      // Call the function that checks for misinformation
      const gptResult = await checkStatementWithGPT(statement);
      
      // Parse the result into JSON
      const parsedResult = JSON.parse(gptResult);
      console.log("Parsed GPT Result: ", parsedResult);

      // Set the values based on the results of the GPT check
      const isMisinformation = parsedResult.isMisinformation || false; // Default to false if not set
      const reasoning = parsedResult.reasoning || 'No reasoning provided';
      const verifiedInfo = parsedResult.verifiedInfo || 'No verified information provided';

      // Now save the statement along with the results of the misinformation check
      await compareController.saveStatement({
        body: { statement, isMisinformation, reasoning, verifiedInfo }
      }, res);
      
      console.log('Misinformation check complete and statement saved.'); // Log success
      // This response can be omitted if already sent in saveStatement
      // res.status(200).json({ message: 'Misinformation check complete and statement saved.' });
    } catch (error) {
      console.error('Error comparing statement:', error);
      res.status(500).json({ error: 'Failed to compare statement' });
    }
  },

  async saveStatement(req, res) {
    const { statement, isMisinformation, reasoning, verifiedInfo } = req.body;

    try {
      const db = await getFirestore();
      const statementRef = db.collection('statements').doc(String(Date.now()));
      await statementRef.set({
        statement,
        isMisinformation,
        reasoning,
        verifiedInfo,
        dateSaved: new Date(),
      });
      console.log('Statement saved successfully:', { statement, isMisinformation, reasoning, verifiedInfo });
      res.status(200).json({ message: 'Statement saved successfully' });
    } catch (error) {
      console.error('Error saving statement:', error);
      res.status(500).json({ error: 'Failed to save statement' });
    }
  },
};

module.exports = compareController;
