import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import db from "@/app/firebase";

export async function POST(req) {
  try {
    console.log("Landed in upload route");

    const { tweets } = await req.json();

    for (let tweet of tweets) {
      const tweetId = tweet.id;

      // Check if the tweet already exists in Firestore
      const collectionRef = collection(db, "tweets");
      const q = query(collectionRef, where("id", "==", tweetId));
      const existingTweets = await getDocs(q);

      if (existingTweets.empty) {
        // Upload the tweet to Firestore
        await addDoc(collectionRef, { ...tweet, id: tweetId });

        // Call the misinformation check API
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/checkMisinformation`, {
          method: "POST",
          body: JSON.stringify({ tweet }), // Pass the tweet to the misinformation route
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          console.error("Error checking misinformation:", response.statusText);
        }
      } else {
        console.log(`Duplicate tweet with ID ${tweetId} skipped.`);
      }
    }

    console.log("Tweets Uploaded");
    return new Response(JSON.stringify({ message: "Tweets uploaded and sent for misinformation check successfully" }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error uploading tweets to Firebase:", error);
    return new Response(JSON.stringify({ error: "Error uploading tweets" }), { status: 500 });
  }
}
