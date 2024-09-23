// components/TimeFrameChart.js
"use client"; // Ensure this is a client component

import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale, 
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Button, ButtonGroup, Card, CardContent, Typography, Box } from '@mui/material';

// Register the components we need in Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TimeFrameChart = () => {
  const [timeFrame, setTimeFrame] = useState('weekly');

  const data = {
    labels:
      timeFrame === 'daily'
        ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        : timeFrame === 'weekly'
        ? ['Week 1', 'Week 2', 'Week 3', 'Week 4']
        : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Misinformation Tweets',
        data:
          timeFrame === 'daily'
            ? [5, 10, 8, 15, 9, 12, 20]
            : timeFrame === 'weekly'
            ? [50, 80, 100, 60]
            : [120, 300, 250, 350, 400, 450, 500, 600, 700, 800, 850, 900],
        fill: false,
        borderColor: '#849785', // Updated color scheme
        tension: 0.1,
      },
    ],
  };

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom sx={{ color: '#849785', fontWeight: 'bold' }}>
          Tweets Over Time
        </Typography>

        <ButtonGroup variant="contained" aria-label="time frame button group">
          <Button
            onClick={() => setTimeFrame('daily')}
            disabled={timeFrame === 'daily'}
            sx={{
              backgroundColor: timeFrame === 'daily' ? '#849785' : '#849785',
              color: '#fafafa',
              '&:hover': {
                backgroundColor: '#849785', // Keep consistent hover state
              }
            }}
          >
            Daily
          </Button>
          <Button
            onClick={() => setTimeFrame('weekly')}
            disabled={timeFrame === 'weekly'}
            sx={{
              backgroundColor: timeFrame === 'weekly' ? '#849785' : '#849785',
              color: '#fafafa',
              '&:hover': {
                backgroundColor: '#849785', // Keep consistent hover state
              }
            }}
          >
            Weekly
          </Button>
          <Button
            onClick={() => setTimeFrame('monthly')}
            disabled={timeFrame === 'monthly'}
            sx={{
              backgroundColor: timeFrame === 'monthly' ? '#849785' : '#849785',
              color: '#fafafa',
              '&:hover': {
                backgroundColor: '#849785', // Keep consistent hover state
              }
            }}
          >
            Monthly
          </Button>
        </ButtonGroup>

        <Box mt={2}>
          <Line data={data} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default TimeFrameChart;
