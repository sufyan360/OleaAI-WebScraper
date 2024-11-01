import { NextResponse } from 'next/server';
import { Rettiwt } from 'rettiwt-api';

export async function POST(req) {
  try {
    const rettiwt = new Rettiwt({ apiKey: process.env.X_AUTH_HELPER_KEY, logging: true });
    console.log("INSTANTIATED SCRAPER");

    // Define the search keyword and number of tweets set to 25
    const keyword = 'mpox';
    const tweets = await rettiwt.tweet.search(
      { 
        includeWords: [keyword], 
        excludeWords: ['#mpox'],
        count: 25, 
        replies: false, 
        language: "en" 
      });

    const filteredTweets = tweets.list.map(tweet => ({
      id: tweet.id,
      createdAt: tweet.createdAt,
      fullText: tweet.fullText
    }));

    //console.log(filteredTweets); 
    console.log("Tweets scraped Successfully")
    return NextResponse.json({ success: true, filteredTweets });

  } catch (error) {
    console.error('Error during scraping:', error);
    return NextResponse.json({ success: false, message: 'Scraping failed', error }, { status: 500 });
  }
}
