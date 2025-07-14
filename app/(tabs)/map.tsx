import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import React, { useEffect, useRef } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StudyGroupCard } from '../../components/study-groups/StudyGroupCard';
import { ThemedView } from '../../components/ThemedView';
import { STUDY_GROUPS } from '../../data/studyGroups';

// Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoicGF0dHljYWtlczEyMyIsImEiOiJjbWQwbHowNnkwcnRnMmxxMjZrMXpzM2xpIn0.OSfE2ygeZNGxDOsyWGwsYw';

const CARD_HEIGHT = 200; // Approximate height for study group cards

export default function MapScreen() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [lng] = React.useState(-83.7382); // Ann Arbor longitude
  const [lat] = React.useState(42.2780);  // Ann Arbor latitude
  const [zoom] = React.useState(14);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = React.useState<string | null>(null);

  useEffect(() => {
    if (Platform.OS === 'web' && !map.current && mapContainer.current) {
      try {
        // Initialize map
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [lng, lat],
          zoom: zoom
        });

        // Add markers for each study group
        STUDY_GROUPS.forEach(group => {
          const popup = new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <h3>${group.title}</h3>
              <p>${group.location}</p>
              <p>${group.time}</p>
              <p>${group.memberCount} members</p>
            `);

          const marker = new mapboxgl.Marker()
            .setLngLat(group.coordinates)
            .setPopup(popup)
            .addTo(map.current!);
          
          markers.current.push(marker);
        });
      } catch (err) {
        console.error('Error initializing map:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize map');
      }
    }

    // Cleanup function to remove markers
    return () => {
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
    };
  }, [lng, lat, zoom]);

  const handleGroupPress = (groupId: string) => {
    setSelectedGroup(groupId);
    const group = STUDY_GROUPS.find(g => g.id === groupId);
    if (group && map.current) {
      map.current.flyTo({
        center: group.coordinates,
        zoom: 16,
        duration: 1500
      });
    }
  };

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {/* Study Group Cards */}
      <View style={styles.cardsContainer}>
        <ScrollView 
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardsScrollContent}
        >
          {STUDY_GROUPS.map((group) => (
            <View key={group.id} style={styles.cardWrapper}>
              <StudyGroupCard
                title={group.title}
                subject={group.subject}
                mood={group.mood}
                time={group.time}
                location={group.location}
                memberCount={group.memberCount}
                distance={group.distance}
                coordinates={group.coordinates}
                onPress={() => handleGroupPress(group.id)}
              />
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Map View */}
      <View style={styles.mapContainer}>
        {Platform.OS === 'web' && (
          <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardsContainer: {
    height: CARD_HEIGHT,
    backgroundColor: 'transparent',
  },
  cardsScrollContent: {
    padding: 10,
  },
  cardWrapper: {
    width: 300,
    marginRight: 10,
  },
  mapContainer: {
    flex: 1,
  }
}); 