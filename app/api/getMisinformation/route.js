import { collection, getDocs } from "firebase/firestore";
import db from "@/app/firebase";

export async function GET() {
  try {
    console.log("Landed in /getMisinformation");

    // Fetch all documents from the "statements" collection
    const snapshot = await getDocs(collection(db, "statements"));

    // Filter and transform the documents to return complete information
    const filteredStatements = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((doc) => doc.isMisinformation) // Only include misinformation entries

    //console.log("Filtered Misinformation Data:", filteredStatements);

    // Return the filtered statements
    return new Response(JSON.stringify({ statements: filteredStatements }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching chart data:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch chart data" }),
      { status: 500 }
    );
  }
}
