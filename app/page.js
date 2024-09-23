"use client"
import ScraperButton from './components/scraperbutton';
import TimeFrameChart from './components/timeframechart';
import WorldMap from './components/worldmap';
import { Container, Typography, Grid, Box } from '@mui/material';

export default function Home() {
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

      <ScraperButton />

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <TimeFrameChart />
        </Grid>

        <Grid item xs={12} md={6}>
          <WorldMap />
        </Grid>
      </Grid>
    </Container>
  );
}
