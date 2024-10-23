import { NextResponse } from 'next/server';
import { compareStatement, saveStatement } from '@/backend/controllers/compareController';

export async function POST(req) {
  try {
    console.log("LANDED");
    const { tweet } = await req.json();

    const statementData = {
      statement: tweet.fullText,
      isMisinformation: null,
      reasoning: null,
      verifiedInfo: null
    };

    // Compare statement for misinformation
    const comparisonResult = await compareStatement({ body: statementData });

    // Save the statement and return the result
    await saveStatement(comparisonResult);

    return NextResponse.json({ message: 'Misinformation check complete' }, { status: 200 });
  } catch (error) {
    console.error('Error checking misinformation:', error);
    return NextResponse.json({ message: 'Error checking misinformation', error }, { status: 500 });
  }
}
