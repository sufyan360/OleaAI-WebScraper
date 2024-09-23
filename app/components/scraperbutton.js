"use client"
import { Button, CircularProgress, Box } from '@mui/material';
import { useState } from 'react';

const ScraperButton = () => {
  const [loading, setLoading] = useState(false);

  const startScraping = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/scrape', { method: 'POST' });
      if (response.ok) {
        alert('Scraping started!');
      } else {
        alert('Failed to start scraping.');
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
