import { NextResponse } from 'next/server';
import { getFirestore } from '@/backend/firebase';

export async function GET() {
  try {
    console.log("LANDED in charData");
    const db = await getFirestore();
    const collectionRef = db.collection('statements');
    const snapshot = await collectionRef.get();

    // Extract valid data where isMisinformation is true
    const statements = snapshot.docs
      .map(doc => {
        const data = doc.data();
        //console.log("Original: ", data.dateSaved);

        const date = data.dateSaved ? data.dateSaved.toDate() : null;
        //console.log("DATE: ", date);

        const formattedDate = date ? date.toLocaleDateString() : null;
        //console.log("Formatted: ", formattedDate);

        // Only include entries with valid dates and isMisinformation set to true
        return date && data.isMisinformation ? { dateSaved: formattedDate } : null;
      })
      .filter(statement => statement !== null); // Remove any null values from the array

    //console.log("Filtered Statements: ", statements);
    return NextResponse.json({ statements }, { status: 200 });
  } catch (error) {
    console.error('Error fetching statements:', error);
    return NextResponse.json({ message: 'Error fetching statements', error }, { status: 500 });
  }
}
