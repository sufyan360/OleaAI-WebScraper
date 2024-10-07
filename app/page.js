// app/page.js
'use client';
import ScraperButton from './components/scraperbutton';
import TimeFrameChart from './components/timeframechart';
import WorldMap from './components/worldmap';
import TweetsList from './components/tweetsList'; // Import the new component
import { Container, Typography, Grid, Box } from '@mui/material';
import { useState } from 'react';

export default function Home() {
  const [tweets, setTweets] = useState([]);

  const handleTweetsFetched = (fetchedTweets) => {
    setTweets(fetchedTweets);
  };

  return (
    <Container>
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        align="center"
        sx={{ mt: 2, color: '#849785', fontWeight: 'bold', fontFamily: 'Arial' }}
      >
        Mpox Misinformation Dashboard
      </Typography>

      <ScraperButton onTweetsFetched={handleTweetsFetched} />

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <TimeFrameChart />
        </Grid>

        <Grid item xs={12} md={6}>
          <WorldMap />
        </Grid>
      </Grid>

      {/* Display the tweets at the bottom */}
      {tweets.length > 0 && (
        <Box mt={4}>
          <TweetsList tweets={tweets} />
        </Box>
      )}
    </Container>
  );
}
