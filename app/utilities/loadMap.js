'use client';
import React, { useRef } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

// Map container styling
const containerStyle = {
  width: '100%',
  height: '500px',
};

// Default center of the map
const defaultCenter = {
  lat: -2.1202463076033653,
  lng: 23.34370442874629,
};

const TweetMap = ({ locations }) => {
  const mapRef = useRef(null);

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={1}
        onLoad={(map) => (mapRef.current = map)}
      >
        {/* Render Markers */}
        {locations.map((loc, index) => (
          <Marker
            key={index}
            position={loc.coordinates}
            title={loc.text}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default TweetMap;
