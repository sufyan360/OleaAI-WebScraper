'use client';
import { Button, CircularProgress, Box } from '@mui/material';
import { useState } from 'react';
import axios from 'axios';

const ScraperButton = ({ onTweetsFetched }) => {
  const [loading, setLoading] = useState(false);

  const startScraping = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5001/api/fetch-upload-tweets');

      if (response.status !== 200) {
        throw new Error('Failed to scrape and upload tweets');
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


