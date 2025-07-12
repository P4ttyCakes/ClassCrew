import React from 'react';
import Map, { NavigationControl } from 'react-map-gl';
import { StyleSheet, View } from 'react-native';
import { mapboxConfig } from '../../config/mapbox';

// University of Michigan coordinates (Ann Arbor campus)
const UMICH_COORDINATES = {
  latitude: 42.2780,
  longitude: -83.7382,
  zoom: 14
};

export default function MapView() {
  return (
    <View style={styles.container}>
      <Map
        mapboxAccessToken={mapboxConfig.accessToken}
        initialViewState={{
          longitude: UMICH_COORDINATES.longitude,
          latitude: UMICH_COORDINATES.latitude,
          zoom: UMICH_COORDINATES.zoom
        }}
        style={styles.map}
        mapStyle="mapbox://styles/mapbox/streets-v12"
      >
        <NavigationControl position="top-right" />
      </Map>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%'
  }
}); 