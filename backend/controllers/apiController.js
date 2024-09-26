// apiController.js
const axios = require('axios');
const cheerio = require('cheerio');
const db = require('../firebase');
const { collection, doc, getDoc, updateDoc, setDoc } = require("firebase/firestore");

const apiController = {
  async fetchMpoxData(req, res) {
    console.log('Fetching mpox data...');
    try {
      // Fetch resource metadata from CDC API
      const response = await axios.get('https://tools.cdc.gov/api/v2/resources/media?topic=mpox');
      const resources = response.data.results;
      console.log('API response:', resources[1].source.acronym);
      if (!Array.isArray(resources)) {
        throw new Error('Expected resources to be an array');
    }

      // Process each resource
      for (const resource of resources) {
        const source = resource.source.acronym;
        const title = resource.name;
        const description = resource.description;
        const contentUrl = resource.contentUrl; // Extract content URL

        // Scrape the content from the content URL
        const contentResponse = await axios.get(contentUrl);
        const $ = cheerio.load(contentResponse.data);
        const content = $('body').text(); // Full HTML content

        // Check if resource already exists in Firestore
        const resourceRef = doc(collection(db, 'mpoxResources'), String(resource.id));
        const docSnapshot = await getDoc(resourceRef);
        
        if (!docSnapshot.exists()) {
          // Add new resource
          await setDoc(resourceRef, {
            source,
            title,
            description,
            content,
            dateFetched: new Date(),
        });
        } else {
          // Update existing resource if needed
          await updateDoc(resourceRef, {
            source,
            title,
            description,
            content,
            dateFetched: new Date(),
        });
        }
      }

      res.status(200).json({ message: 'Data fetched and stored successfully' });
    } catch (error) {
      console.error('Error fetching mpox data:', error);
      res.status(500).json({ error: 'Failed to fetch mpox data' });
    }
  },
};

module.exports = apiController;

