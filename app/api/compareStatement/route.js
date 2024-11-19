import { NextResponse } from 'next/server';
import { compareStatement } from '@/backend/controllers/compareController';

export async function POST(req) {
  try {
    const data = await req.json();
    const result = await compareStatement({ body: data });
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to compare statement' }, { status: 500 });
  }
}
