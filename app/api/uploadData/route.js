import { db } from '@/backend/firebase';  // Firestore instance

export async function POST(req, res) {
    try {
        const { tweets } = await req.json();  
        const collectionRef = db.collection('tweets');  // Correct usage for Firebase Admin SDK

        // Iterate over the tweets and upload to Firestore
        for (let tweet of tweets) {
            const tweetId = tweet.id;  

            // Query for existing tweets using the correct Firestore query methods
            const existingTweetQuery = await collectionRef.where('id', '==', tweetId).get();

            // If the tweet doesn't exist, add it to Firestore
            if (existingTweetQuery.empty) {
                await collectionRef.add({ ...tweet, id: tweetId });
                console.log(`Uploaded tweet with ID ${tweetId}`);
            } else {
                console.log(`Duplicate tweet with ID ${tweetId} skipped.`);
            }
        }

        return new Response(JSON.stringify({ message: 'Tweets uploaded successfully' }), { status: 200 });
    } catch (error) {
        console.error('Error uploading tweets to Firebase:', error);
        return new Response(JSON.stringify({ message: 'Error uploading tweets', error }), { status: 500 });
    }
}
