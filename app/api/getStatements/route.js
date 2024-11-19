import { collection, getDocs } from "firebase/firestore";
import db from "@/app/firebase";

export async function GET() {
  try {
    console.log("Landed in /getStatements");
    const snapshot = await getDocs(collection(db, "statements"));
    const statements = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    //console.log("Statements: ", statements);
    return new Response(JSON.stringify({ statements }), { status: 200 });
  } catch (error) {
    console.error("Error fetching statements:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch statements" }), { status: 500 });
  }
}
