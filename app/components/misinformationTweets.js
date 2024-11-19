import { Card, CardContent, Typography, Box, CircularProgress, Avatar } from "@mui/material";
import React, { useState, useEffect } from "react";

const fetchStatements = async () => {
  const response = await fetch("/api/getMisinformation");
  if (!response.ok) {
    throw new Error("Failed to fetch misinformation data");
  }
  const data = await response.json();
  return data.statements; // This will now contain the complete misinformation entries
};

const MisinformationTweets = () => {
  const [misinformationTweets, setMisinformationTweets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const data = await fetchStatements();
        //console.log("Fetched Misinformation Tweets: ", data);

        setMisinformationTweets(data);
      } catch (error) {
        console.error("Error fetching tweets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTweets();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!misinformationTweets.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
        <Typography variant="h6" component="p">
          No misinformation tweets found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2} mt={4}>
      {misinformationTweets.map((item, index) => (
        <Card key={index} sx={{ width: "100%", maxWidth: 600, mb: 6 }}>
          <CardContent>
            <Typography variant="h6" component="p" sx={{ fontWeight: "bold" }}>
              Misinformation Tweet
            </Typography>
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
