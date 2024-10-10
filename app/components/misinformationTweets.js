import { Card, CardContent, Typography, Box, CircularProgress, Avatar} from '@mui/material';
import React, { useState, useEffect } from 'react';

const tweetsData = [

  
  { 
    tweet: "COVID-19 vaccines alter your DNA.",
    reason: "Vaccines do not change your DNA; they only teach your immune system how to fight the virus."
  },
  { 
    tweet: "5G towers spread the coronavirus.",
    reason: "COVID-19 is caused by a virus, not radio waves. 5G technology does not spread the virus."
  },
  { 
    tweet: "Eating garlic cures COVID-19.",
    reason: "There is no scientific evidence that garlic can prevent or cure COVID-19."
  },
  // ...add more tweets here (10 in total)
];

const MisinformationTweets = () => {
  const [misinformationTweets, setMisinformationTweets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch tweets data on component mount
  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const response = await fetch('http://localhost:5001/mpox/history', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        // Filter tweets where isMisinformation is true
        const filteredTweets = data
          .filter(tweet => tweet.isMisinformation)
          .map(tweet => ({
            statement: tweet.statement,
            reasoning: tweet.reasoning,
            verifiedInfo: tweet.verifiedInfo,
          }));

        // Set the state with the filtered and mapped tweets
        setMisinformationTweets(filteredTweets);
      } catch (error) {
        console.error('Error fetching tweets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTweets();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2} mt={4}>
      {misinformationTweets.map((item, index) => (
        <Card key={index} sx={{ width: '100%', maxWidth: 600, mb: 6 }}>
          <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" component="p" sx={{ fontWeight: 'bold' }}>
                  Misinformation Tweet
                </Typography>
                <Avatar 
                  alt="Tweet Image" 
                  src={'https://help.iubenda.com/wp-content/uploads/2020/05/twitter.png'} 
                  sx={{ width: 56, height: 56, marginLeft: 2 }} 
                />
              </Box>
            <Typography variant="body1" component="p" sx={{ marginBottom: 3, color: 'black'}}>
                {item.statement}
              </Typography>
              <Typography variant="body2" sx={{ marginBottom: 3 , color: 'black'}}>
                Reasoning: {item.reasoning}
              </Typography>
              <Typography variant="body2" sx={{ marginBottom: 1 , color: 'black'}}>
                Verified Info: {item.verifiedInfo}
              </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default MisinformationTweets;
