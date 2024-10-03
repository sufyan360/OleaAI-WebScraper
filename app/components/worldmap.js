'use client';
import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import TweetMap from '../api/loadMap/route';  // Import TweetMap

const locations = [
  { id: 1, coordinates: { lat: 51.505, lng: -0.09 }, text: 'Tweet from London', location: 'London, UK' },
  { id: 2, coordinates: { lat: 40.7128, lng: -74.006 }, text: 'Tweet from New York', location: 'New York, USA' },
];

const WorldMap = () => {
  return (
    <Card sx={{ mt: 2, borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)' }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom sx={{ color: '#849785', fontWeight: 'bold' }}>
          Geographic Distribution of Misinformation
        </Typography>
        <Box sx={{ height: '500px', width: '100%', borderRadius: '10px', overflow: 'hidden' }}>
          {/* Pass the locations to TweetMap */}
          <TweetMap locations={locations} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default WorldMap;
