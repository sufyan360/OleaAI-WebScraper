import { NextResponse } from 'next/server';
import { Rettiwt } from 'rettiwt-api';

export async function POST(req) {
  try {
    // Instantiate a new Twitter client
    const rettiwt = new Rettiwt({ apiKey: process.env.X_AUTH_HELPER_KEY, logging: true });
    console.log("INSTANTIATED");

    // Define the search keyword and number of tweets set to 25
    const keyword = 'mpox';
    const tweets = await rettiwt.tweet.search({ includeWords: [keyword], count: 25, replies: false, language: "en" });

    // Access the list of tweets from the `CursoredData` object
    const filteredTweets = tweets.list.map(tweet => ({
      id: tweet.id,
      createdAt: tweet.createdAt,
      fullText: tweet.fullText
    }));

    console.log(filteredTweets);  // Logs the filtered tweets to the console
    return NextResponse.json({ success: true, filteredTweets });

  } catch (error) {
    console.error('Error during scraping:', error);
    return NextResponse.json({ success: false, message: 'Scraping failed', error }, { status: 500 });
  }
}
