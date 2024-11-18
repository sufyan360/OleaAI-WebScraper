const axios = require('axios');
const { getFirestore } = require('../firebase'); 
const compareController = require('./compareController');
const { Rettiwt } = require('rettiwt-api');

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

        if (!docSnapshot.exists) {
          // Add new resource to Firestore
          await resourceRef.set({
            source,
            title,
            description,
            content,
            dateFetched: new Date(),
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
          content
        };
      }));

      res.status(200).json({ resources: verifiedResources });
    } catch (error) {
      console.error('Error fetching mpox data:', error);
      res.status(500).json({ error: 'Failed to fetch mpox data' });
    }
  },
  async fetchAndUploadTweets(req, res) {
    try {
      const rettiwt = new Rettiwt({ apiKey: process.env.X_AUTH_HELPER_KEY, logging: true });
      console.log("INSTANTIATED SCRAPER");
  
      // Define the search keyword and number of tweets set to 25
      const keyword = 'mpox';
      const tweets = await rettiwt.tweet.search(
        { 
          includeWords: [keyword], 
          excludeWords: ['#mpox'],
          count: 25, 
          replies: false, 
          language: "en" 
        });
  
      const filteredTweets = tweets.list.map(tweet => ({
        id: tweet.id,
        createdAt: tweet.createdAt,
        fullText: tweet.fullText
      }));
  
      //console.log(filteredTweets); 
      console.log("Tweets scraped Successfully")

      const db = await getFirestore();
      const collectionRef = db.collection('tweets');

      for (let tweet of filteredTweets) {
        const tweetId = tweet.id;

      // Check if the tweet already exists in Firestore
      const existingTweetQuery = await collectionRef.where('id', '==', tweetId).get();
      if (existingTweetQuery.empty) {
        // Upload the tweet to Firestore
        await collectionRef.add({ ...tweet, id: tweetId });
        console.log(`Uploaded tweet with ID ${tweetId}`);

        // Call the new route to check for misinformation
        // Use compareStatement method directly instead of making an HTTP request
        const { statement, isMisinformation, reasoning, verifiedInfo } = await compareController.compareStatement({
          body: { statement: tweet.fullText }
        });

        console.log(`Misinformation check result for tweet ID ${tweetId}:`, {
          isMisinformation,
          reasoning,
          verifiedInfo,
        });

        } else {
          console.log(`Duplicate tweet with ID ${tweetId} skipped.`);
        }
      }

        console.log("Tweets Uploaded and Sent for Misinformation Check");
      res.status(200).json({ 
        message: 'Tweets fetched, uploaded, and checked for misinformation successfully',
        tweets: filteredTweets 
      });
    } catch (error) {
      console.error('Error fetching and uploading tweets:', error);
      res.status(500).json({ message: 'Error fetching and uploading tweets', error });
    }
  }
}

module.exports = apiController;
