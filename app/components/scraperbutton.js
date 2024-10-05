'use client';
import { Button, CircularProgress, Box } from '@mui/material';
import { useState } from 'react';
import uploadToFirebase from '../api/uploadData/route'; 

const ScraperButton = ({ onTweetsFetched }) => {
  const [loading, setLoading] = useState(false);

  const startScraping = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/scrapeData', { method: 'POST' });

      if (!response.ok) {
        throw new Error('Failed to scrape tweets');
      }

      const data = await response.json(); 
      if (data && data.filteredTweets) {
        onTweetsFetched(data.filteredTweets);
        
        // Upload tweets to Firebase
        await uploadToFirebase(data.filteredTweets); 
      }

    } catch (error) {
      console.error('Error:', error);
      alert('Error starting scraping.');
    }
    setLoading(false);
  };

  return (
    <Box mt={2} textAlign="center">
      <Button
        variant="contained"
        color="primary"
        onClick={startScraping}
        disabled={loading}
        startIcon={loading && <CircularProgress size={20} color="inherit" />}
        sx={{ backgroundColor: '#849785', color: '#fafafa', borderRadius: 1 }}
      >
        {loading ? 'Scraping...' : 'Start Scraping'}
      </Button>
    </Box>
  );
};

export default ScraperButton;
