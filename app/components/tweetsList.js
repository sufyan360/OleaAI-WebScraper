// components/TweetsList.js
'use client';
import { Box } from '@mui/material';

const TweetsList = ({ tweets }) => {
  return (
    <Box mt={3} textAlign="center">
      <h3>Scraped Tweets:</h3>
      <ul>
        {tweets.map((tweet) => (
          <li key={tweet.id}>
            <p><strong>ID:</strong> {tweet.id}</p>
            <p><strong>Created At:</strong> {new Date(tweet.createdAt).toLocaleString()}</p>
            <p><strong>Full Text:</strong> {tweet.fullText}</p>
          </li>
        ))}
      </ul>
    </Box>
  );
};

export default TweetsList;
