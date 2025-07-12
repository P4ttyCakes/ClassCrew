import React, { useEffect, useRef } from 'react';
import { View, Platform, Text } from 'react-native';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoicGF0dHljYWtlczEyMyIsImEiOiJjbWQwbHowNnkwcnRnMmxxMjZrMXpzM2xpIn0.OSfE2ygeZNGxDOsyWGwsYw';

export default function MapScreen() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [lng] = React.useState(-83.7382); // Ann Arbor longitude
  const [lat] = React.useState(42.2780);  // Ann Arbor latitude
  const [zoom] = React.useState(13);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    if (Platform.OS === 'web' && !map.current && mapContainer.current) {
      try {
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [lng, lat],
          zoom: zoom
        });
      } catch (err) {
        console.error('Error initializing map:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize map');
      }
    }
  }, [lng, lat, zoom]);

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {Platform.OS === 'web' && (
        <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
      )}
    </View>
  );
} 