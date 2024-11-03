// components/TimeFrameChart.js
"use client";
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Button, ButtonGroup, Card, CardContent, Typography, Box } from '@mui/material';
import { startOfWeek, startOfMonth, startOfYear, endOfWeek, endOfMonth, endOfYear, format, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval } from 'date-fns';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TimeFrameChart = () => {
  const [timeFrame, setTimeFrame] = useState('week');
  const [dataPoints, setDataPoints] = useState([]);

  useEffect(() => {
    fetchData();
  }, [timeFrame]);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/chartData');
      if (!response.ok) throw new Error('Error fetching data');
      
      const { statements } = await response.json();
      const filteredData = transformData(statements, timeFrame);
      setDataPoints(filteredData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Transform the data based on the selected time frame
  const transformData = (data, frame) => {
    const now = new Date();
    let intervals;
    let dateFormat;

    if (frame === 'week') {
      intervals = eachDayOfInterval({ start: startOfWeek(now), end: endOfWeek(now) });
      dateFormat = 'EEE';
    } else if (frame === 'month') {
      intervals = eachWeekOfInterval({ start: startOfMonth(now), end: endOfMonth(now) });
      dateFormat = "'Week' w";
    } else if (frame === 'year') {
      intervals = eachMonthOfInterval({ start: startOfYear(now), end: endOfYear(now) });
      dateFormat = 'MMM';
    } else if (frame === 'all') {
      intervals = eachMonthOfInterval({ start: new Date('2024-10-01'), end: now });
      dateFormat = 'MMM yyyy';
    }

    // Count occurrences within each interval
    return intervals.map(intervalStart => {
      const intervalEnd = frame === 'week'
        ? intervalStart
        : frame === 'month'
        ? new Date(intervalStart.getTime() + 6 * 24 * 60 * 60 * 1000)
        : new Date(intervalStart.getFullYear(), intervalStart.getMonth() + 1, 0);

      const count = data.filter(doc => {
        const dateSaved = new Date(doc.dateSaved);
        return dateSaved >= intervalStart && dateSaved <= intervalEnd;
      }).length;

      return { label: format(intervalStart, dateFormat), count };
    });
  };

  const labels = dataPoints.map(point => point.label);
  const datasetData = dataPoints.map(point => point.count);

  const data = {
    labels,
    datasets: [
      {
        label: 'Misinformation Tweets',
        data: datasetData,
        backgroundColor: '#849785',
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 }, // To keep the Y-axis positive and integer-based for counts
      },
    },
  };

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom sx={{ color: '#849785', fontWeight: 'bold' }}>
          Misinformation Tweets Over Time
        </Typography>

        <ButtonGroup variant="contained" aria-label="time frame button group">
          <Button
            onClick={() => setTimeFrame('week')}
            disabled={timeFrame === 'week'}
            sx={{ backgroundColor: timeFrame === 'week' ? '#849785' : '#849785', color: '#fafafa', '&:hover': { backgroundColor: '#849785' } }}
          >
            Week
          </Button>
          <Button
            onClick={() => setTimeFrame('month')}
            disabled={timeFrame === 'month'}
            sx={{ backgroundColor: timeFrame === 'month' ? '#849785' : '#849785', color: '#fafafa', '&:hover': { backgroundColor: '#849785' } }}
          >
            Month
          </Button>
          <Button
            onClick={() => setTimeFrame('year')}
            disabled={timeFrame === 'year'}
            sx={{ backgroundColor: timeFrame === 'year' ? '#849785' : '#849785', color: '#fafafa', '&:hover': { backgroundColor: '#849785' } }}
          >
            Year
          </Button>
          <Button
            onClick={() => setTimeFrame('all')}
            disabled={timeFrame === 'all'}
            sx={{ backgroundColor: timeFrame === 'all' ? '#849785' : '#849785', color: '#fafafa', '&:hover': { backgroundColor: '#849785' } }}
          >
            All
          </Button>
        </ButtonGroup>

        <Box mt={2}>
          <Bar data={data} options={options} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default TimeFrameChart;
