import { NextResponse } from "next/server";
import fetch from 'node-fetch';

global.fetch = fetch;

export async function POST(req) {
    console.log("Received POST request in /api/loadData");

}