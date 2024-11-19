import { Card, CardContent, Typography, Box, CircularProgress, Avatar } from "@mui/material";
import React, { useState, useEffect } from "react";

// Fetch statements from your Next.js API route
const fetchStatements = async () => {
  const response = await fetch("/api/getStatements");
  if (!response.ok) {
    throw new Error("Failed to fetch statements");
  }
  const data = await response.json();
  return data.statements;
};

const MisinformationTweets = () => {
  const [misinformationTweets, setMisinformationTweets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const data = await fetchStatements();

        // Safely filter tweets where result exists and isMisinformation is true
        const filteredTweets = data
          .filter((tweet) => tweet.result && tweet.result.isMisinformation)
          .map((tweet) => ({
            statement: tweet.statement,
            reasoning: tweet.result.reasoning || "No reasoning provided",
            verifiedInfo: tweet.result.verifiedInfo || "No verified info available",
          }));

        setMisinformationTweets(filteredTweets);
      } catch (error) {
        console.error("Error fetching tweets:", error);
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
        <Card key={index} sx={{ width: "100%", maxWidth: 600, mb: 6 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" component="p" sx={{ fontWeight: "bold" }}>
                Misinformation Tweet
              </Typography>
              <Avatar
                alt="Tweet Image"
                src="https://help.iubenda.com/wp-content/uploads/2020/05/twitter.png"
                sx={{ width: 56, height: 56, marginLeft: 2 }}
              />
            </Box>
            <Typography variant="body1" component="p" sx={{ marginBottom: 3, color: "black" }}>
              {item.statement}
            </Typography>
            <Typography variant="body2" sx={{ marginBottom: 3, color: "black" }}>
              Reasoning: {item.reasoning}
            </Typography>
            <Typography variant="body2" sx={{ marginBottom: 1, color: "black" }}>
              Verified Info: {item.verifiedInfo}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default MisinformationTweets;
