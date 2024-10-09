import { NextResponse } from 'next/server';
import { compareStatement } from '@/backend/controllers/compareController';

export async function POST(req) {
  try {
    console.log("LANDED");
    const { tweet } = await req.json();

    // Prepare statement data for misinformation check
    const statementData = {
      statement: tweet.fullText,
      isMisinformation: null,  // Will be determined
      reasoning: null,         // Will be determined
      verifiedInfo: null       // Will be determined
    };

    // Call compareStatement to check for misinformation
    await compareStatement({
      body: statementData
    });

    return NextResponse.json({ message: 'Misinformation check complete' }, { status: 200 });
  } catch (error) {
    console.error('Error checking misinformation:', error);
    return NextResponse.json({ message: 'Error checking misinformation', error }, { status: 500 });
  }
}
