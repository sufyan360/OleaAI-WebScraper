import React, { useState } from 'react';
import axios from 'axios';

const FetchMpoxData = () => {
  const [mpoxData, setMpoxData] = useState([]);
  const [error, setError] = useState(null);

  const handleFetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/public-data');
      setMpoxData(response.data.resources); // Adjust based on your response structure
      setError(null); // Clear any previous errors
      console.log("Got new resources")
    } catch (err) {
      console.error('Error fetching mpox data:', err);
      setError('Failed to fetch mpox data');
    }
  };

  return (
    <div>
      <button sx={{ backgroundColor: '#849785', color: '#fafafa', borderRadius: 1 }} onClick={handleFetchData}>Fetch Mpox Resources</button>
      {error && <p>{error}</p>}
      {mpoxData.length > 0 && (
        <ul>
          {mpoxData.map((item, index) => (
            <li key={index}>
              <h4>{item.title}</h4>
              <p>{item.description}</p>
              <p>Is Misinformation: {item.isMisinformation ? 'Yes' : 'No'}</p>
              <p>Reasoning: {item.reasoning}</p>
              <p>Verified Info: {item.verifiedInfo}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FetchMpoxData;
