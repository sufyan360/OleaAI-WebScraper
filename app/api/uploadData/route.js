import { getFirestore } from '@/backend/firebase';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { tweets } = await req.json();
    const db = await getFirestore();
    const collectionRef = db.collection('tweets');

    for (let tweet of tweets) {
      const tweetId = tweet.id;

      // Check if the tweet already exists in Firestore
      const existingTweetQuery = await collectionRef.where('id', '==', tweetId).get();
      if (existingTweetQuery.empty) {
        // Upload the tweet to Firestore
        await collectionRef.add({ ...tweet, id: tweetId });
        //console.log(`Uploaded tweet with ID ${tweetId}`);

        // Call the new route to check for misinformation
        const response = await fetch('http://localhost:3000/api/checkMisinformation', {
          method: 'POST',
          body: JSON.stringify({ tweet }),  // Pass the tweet to the misinformation route
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          console.error('Error checking misinformation:', response.statusText);
        }
      } else {
        console.log(`Duplicate tweet with ID ${tweetId} skipped.`);
      }
    }

    console.log("Tweets Uploaded and Sent for Misinformation Check");
    return NextResponse.json({ message: 'Tweets uploaded and sent for misinformation check successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error uploading tweets to Firebase:', error);
    return NextResponse.json({ message: 'Error uploading tweets', error }, { status: 500 });
  }
}
