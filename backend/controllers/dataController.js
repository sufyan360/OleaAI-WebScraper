import { db, serverTimestamp } from "../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

const dataController = {
  async saveStatement({ statement, isMisinformation, reasoning, verifiedInfo }) {
    if (!statement || isMisinformation === undefined || !reasoning || !verifiedInfo) {
      throw new Error("Required fields are missing");
    }

    try {
      const docRef = await addDoc(collection(db, "statements"), {
        statement,
        result: {
          isMisinformation,
          reasoning,
          verifiedInfo,
        },
        createdAt: serverTimestamp(),
      });

      console.log("Statement saved successfully:", { id: docRef.id });
      return { id: docRef.id, message: "Statement saved successfully" };
    } catch (error) {
      console.error("Error saving statement:", error);
      throw new Error("Failed to save statement");
    }
  },

  async getStatements() {
    try {
      const snapshot = await getDocs(collection(db, "statements"));
      const statements = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Fetched statements successfully:", statements);
      return statements;
    } catch (error) {
      console.error("Error fetching statements:", error);
      throw new Error("Failed to fetch statements");
    }
  },
};

export default dataController;
