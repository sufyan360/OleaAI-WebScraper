"use client"
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Typography, Card, CardContent, Box } from '@mui/material';

const WorldMap = () => {
  const position = [51.505, -0.09];  // Default position (London)

  return (
    <Card sx={{ mt: 2, borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)' }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom sx={{ color: '#849785', fontWeight: 'bold' }}>
          Geographic Distribution of Misinformation
        </Typography>
        <Box sx={{ height: '500px', width: '100%', borderRadius: '10px', overflow: 'hidden' }}>
          <MapContainer center={position} zoom={2} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[51.505, -0.09]}>
              <Popup>
                Example Tweet <br /> London.
              </Popup>
            </Marker>
          </MapContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default WorldMap;
