// app/page.js
'use client';
import ScraperButton from './components/scraperbutton';
import TimeFrameChart from './components/timeframechart';
import WorldMap from './components/worldmap';
import TweetsList from './components/tweetsList'; // Import the new component
import { Container, Typography, Grid, Box, AppBar, Toolbar, IconButton, Link} from '@mui/material';
import { useState } from 'react';
import FetchMpoxData from './components/fetchMpoxDataButton';
import MisinformationTweets from './components/misinformationTweets';
import Icon from '@mdi/react';
import { mdiFacebook as Facebook, mdiTwitter as Twitter, mdiLinkedin as LinkedIn } from '@mdi/js';

export default function Home() {
  const [tweets, setTweets] = useState([]);

  const handleTweetsFetched = (fetchedTweets) => {
    setTweets(fetchedTweets);
  };

  /*
        <Grid item xs={12} md={6}>
          <WorldMap />
        </Grid>
  */
  return (
    <Container>
      <AppBar position="relative" 
            sx={{
                width: '100%',
                bgcolor: 'white',
                zIndex: (theme) => theme.zIndex.appBar,
                borderBottom: '1px solid black',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                height: '10vh',
                display: 'flex',
                flexDirection: 'column', 
                justifyContent: 'center',
            }}>
            <Toolbar 
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                }}>
                <Typography 
                    variant="h6" 
                    sx={{ display: 'flex', cursor: 'pointer', fontWeight: 700, color: '#849785', fontSize: '2.5vw'}}>
                    OLEA
                </Typography>
            </Toolbar>
        </AppBar>
      <Box sx={{mt: '10vh'}}>
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        align="center"
        sx={{ mt: 2, color: '#849785', fontWeight: '300', fontFamily: 'Arial' }}
      >
        Mpox Misinformation Dashboard
      </Typography>

      <ScraperButton onTweetsFetched={handleTweetsFetched} />

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <TimeFrameChart />
        </Grid>

      </Grid>

      {/* Display the tweets at the bottom */}
      {tweets.length > 0 && (
        <Box mt={4}>
          <TweetsList tweets={tweets} />
        </Box>
      )}
      <Box>
        <MisinformationTweets />
      </Box>
    </Box>
    <Box
        sx={{
          bgcolor: '#849785',
          padding: '20px',
          textAlign: 'center',
          color: 'white',
        }}
      >
        <Typography variant="h6" sx={{ marginBottom: '2vh', fontWeight: 'bolder'}}>
          Empowering communities through accessible health information.
        </Typography>
        <Box sx={{ marginBottom: '20px' }}>
          <Link href="" underline="hover" sx={{ color: 'white', margin: '0 10px', fontWeight: 200}}>
            Privacy Policy
          </Link>
          <Link href="" underline="hover" sx={{ color: 'white', margin: '0 10px', fontWeight: 200}}>
            Terms of Service
          </Link>
          <Link href="" underline="hover" sx={{ color: 'white', margin: '0 10px', fontWeight: 200}}>
            Contact Info
          </Link>
        </Box>
        <Box>
          <Icon path={Facebook} size={1} href="" sx={{ color: 'white' }} />
          <Icon path={Twitter} size={1} href="" sx={{ color: 'white' }} />
          <Icon path={LinkedIn} size={1} href="" sx={{ color: 'white' }} />
        </Box>
      </Box>
    </Container>
  );
}
