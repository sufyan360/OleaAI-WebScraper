import { collection, addDoc } from "firebase/firestore";
import db from "@/app/firebase";
import { checkStatementWithGPT } from "@/backend/services/gptService";

export async function POST(req) {
  try {
    console.log("LANDED IN CHECK MISINFORMATION ROUTE");

    const { tweet } = await req.json();

    const statementData = {
      statement: tweet.fullText,
    };

    // Call GPT service to check for misinformation
    const comparisonResult = await checkStatementWithGPT(statementData.statement);

    // Ensure the comparisonResult includes the required fields
    const { isMisinformation, reasoning, verifiedInfo } = comparisonResult;

    // Save the result to Firestore with separate fields
    const docRef = await addDoc(collection(db, "statements"), {
      statement: statementData.statement,
      isMisinformation,
      reasoning,
      verifiedInfo,
      dateSaved: new Date(),
    });

    //console.log(`Misinformation result saved with ID: ${docRef.id}`);

    return new Response(
      JSON.stringify({ message: "Misinformation check complete" }),
      { status: 200 }
    );
  } catch (error) {
      console.error("Error checking misinformation:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500 }
      );
  }
}
