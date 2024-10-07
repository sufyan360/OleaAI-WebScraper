import { db } from '@/backend/firebase'; 
import { NextResponse } from 'next/server';  

export async function POST(req) {  
    try {
        const { tweets } = await req.json();  
        const collectionRef = db.collection('tweets');  

        // Loop through the tweets to upload each to Firestore
        for (let tweet of tweets) {
            const tweetId = tweet.id;  

            const existingTweetQuery = await collectionRef.where('id', '==', tweetId).get();

            // If no existing tweet is found, add the new tweet to Firestore
            if (existingTweetQuery.empty) {
                await collectionRef.add({ ...tweet, id: tweetId });
                console.log(`Uploaded tweet with ID ${tweetId}`);
            } else {
                console.log(`Duplicate tweet with ID ${tweetId} skipped.`);
            }
        }

        return NextResponse.json({ message: 'Tweets uploaded successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error uploading tweets to Firebase:', error);

        return NextResponse.json({ message: 'Error uploading tweets', error }, { status: 500 });
    }
}
