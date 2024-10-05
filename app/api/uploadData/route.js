import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import db from '@/backend/firebase'; 

async function uploadToFirebase(tweets) {
  const collectionRef = collection(db, 'tweets');

  try {
    for (let tweet of tweets) {
      const tweetLink = tweet.link;

      const tweetQuery = query(collectionRef, where('link', '==', tweetLink));
      const querySnapshot = await getDocs(tweetQuery);

      // If no duplicate tweets found, upload the new tweet
      if (querySnapshot.empty) {
        await addDoc(collectionRef, tweet);
        console.log(`Uploaded tweet with ID ${tweetLink}`);
      } else {
        console.log(`Duplicate tweet with ID ${tweetLink} skipped.`);
      }
    }
    console.log('Data uploaded to Firebase successfully!');
  } catch (error) {
    console.error('Error uploading tweets to Firebase:', error);
  }
}

export default uploadToFirebase;
