import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StudyGroupCard } from '../../components/study-groups/StudyGroupCard';
import { ThemedView } from '../../components/ThemedView';
import { StudyGroup } from '../../data/studyGroups';
import { events } from '../../src/utils/events';
import { subscribeToStudyGroups } from '../../src/utils/study-groups';

// Import the subject gradients from StudyGroupCard
const subjectGradients: Record<string, [string, string]> = {
  math: ['#3B82F6', '#8B5CF6'],
  english: ['#10B981', '#14B8A6'],
  science: ['#EF4444', '#F97316'],
  history: ['#F59E0B', '#EAB308'],
  computer: ['#6366F1', '#8B5CF6'],
  business: ['#059669', '#10B981'],
  art: ['#EC4899', '#F43F5E'],
  default: ['#8B5CF6', '#6366F1']
};

const ACCENT = 'rgb(91, 134, 197)';

// Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoicGF0dHljYWtlczEyMyIsImEiOiJjbWQwbHowNnkwcnRnMmxxMjZrMXpzM2xpIn0.OSfE2ygeZNGxDOsyWGwsYw';

const CARD_HEIGHT = 70; // Reduced height for compact cards

export default function MapScreen() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const activePopup = useRef<mapboxgl.Popup | null>(null);
  const [lng] = React.useState(-83.7382); // Ann Arbor longitude
  const [lat] = React.useState(42.2780);  // Ann Arbor latitude
  const [zoom] = React.useState(11.5); // More zoomed out to show more of the city
  const [error, setError] = React.useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = React.useState<string | null>(null);
  // Firestore-backed groups for the top SGC list only (map markers remain mock)
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Listen for data clear events
  useEffect(() => {
    const unsubscribe = events.subscribe('dataCleared', () => {
      // Clear UI immediately and refresh subscription
      setStudyGroups([]);
      setLoading(true);
      setRefreshKey(k => k + 1);
    });
    return () => unsubscribe();
  }, []);

  // Subscribe to Firestore groups for the top cards only
  useEffect(() => {
    const unsubscribe = subscribeToStudyGroups(
      (groups) => {
        // Deduplicate by id and keep only groups with valid coordinates
        const seen = new Set<string>();
        const unique = groups.filter(g => {
          if (!g || !g.id) return false;
          if (seen.has(g.id)) return false;
          seen.add(g.id);
          const c = g.coordinates as any;
          const valid = Array.isArray(c) && c.length === 2 && isFinite(c[0]) && isFinite(c[1]);
          return valid;
        });
        setStudyGroups(unique);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [refreshKey]);

  useEffect(() => {
    if (Platform.OS !== 'web' || !mapContainer.current) return;
    try {
      // Initialize map once
      if (!map.current) {
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [lng, lat],
          zoom: zoom
        });
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      }

      // Rebuild markers on every data change
      markers.current.forEach(marker => marker.remove());
      markers.current = [];

      studyGroups.forEach(group => {
        const color = subjectGradients[group.subject][0];
        const displayCount = 3;
        const memberList = (group as any).members ?? (group as any).users ?? [];
        const visibleMembers = memberList.slice(0, displayCount);
        const remainingCount = memberList.length - displayCount;
        const memberPicsHTML = visibleMembers.map((member: any, index: number) => `
          <div style="
            width: 24px;
            height: 24px;
            border-radius: 50%;
            border: 1.5px solid white;
            overflow: hidden;
            margin-left: ${index > 0 ? '-8px' : '0'};
            position: relative;
          ">
            <img 
              src="${member.profilePicture}" 
              style="width: 100%; height: 100%; object-fit: cover;"
              alt="${member.name}"
            />
          </div>
        `).join('') + (remainingCount > 0 ? `
          <div style="
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background-color: rgba(0,0,0,0.1);
            border: 1.5px solid white;
            margin-left: -8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            color: #666;
          ">+${remainingCount}</div>
        ` : '');

        const popupHTML = `
          <div style="
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            padding: 8px 0;
            min-width: 200px;
          ">
            <div style="
              margin: -8px -8px 8px -8px;
              padding: 8px;
              background-color: ${color};
              border-radius: 3px 3px 0 0;
            ">
              <h3 style="
                margin: 0;
                color: white;
                font-size: 14px;
                font-weight: 600;
              ">${group.title}</h3>
            </div>
            <div style="
              display: flex;
              flex-direction: column;
              gap: 8px;
              padding: 0 8px;
            ">
              <div style="
                display: flex;
                flex-direction: column;
                gap: 4px;
                font-size: 12px;
                color: #666;
              ">
                <div style="display: flex; align-items: center; gap: 6px;">
                  <span style="color: ${color};">📍</span>
                  ${group.location}
                </div>
                <div style="display: flex; align-items: center; gap: 6px;">
                  <span style="color: ${color};">🕒</span>
                  ${group.time}
                </div>
                <div style="
                  margin-top: 6px;
                  padding: 8px;
                  background-color: #f8f9fa;
                  border-radius: 4px;
                  border-left: 3px solid ${color};
                ">
                  <div style="
                    font-size: 11px;
                    color: #666;
                    line-height: 1.4;
                  ">${group.description}</div>
                </div>
              </div>
              
              <div style="
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 4px 0;
              ">
                <div style="
                  display: flex;
                  align-items: center;
                ">
                  ${memberPicsHTML}
                </div>
              </div>

              <button style="
                background-color: ${color};
                color: white;
                border: none;
                border-radius: 6px;
                padding: 8px;
                font-size: 13px;
                font-weight: 600;
                cursor: pointer;
                width: 100%;
                margin-top: 4px;
                transition: opacity 0.2s;
              " onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">
                Join Group
              </button>
            </div>
          </div>
        `;

        const popup = new mapboxgl.Popup({
          offset: 25,
          closeButton: false,
          className: 'custom-popup'
        })
          .setHTML(popupHTML)
          .on('open', () => {
            if (activePopup.current && activePopup.current !== popup) {
              activePopup.current.remove();
            }
            activePopup.current = popup;
          })
          .on('close', () => {
            if (activePopup.current === popup) {
              activePopup.current = null;
            }
          });

        const marker = new mapboxgl.Marker({ color })
          .setLngLat(group.coordinates)
          .setPopup(popup)
          .addTo(map.current!);
        markers.current.push(marker);
      });
    } catch (err) {
      console.error('Error initializing map:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize map');
    }

    return () => {
      if (activePopup.current) {
        activePopup.current.remove();
        activePopup.current = null;
      }
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
    };
  }, [lng, lat, zoom, studyGroups]);

  const handleGroupPress = (groupId: string) => {
    setSelectedGroup(groupId);
    const group = studyGroups.find(g => g.id === groupId);
    if (group && map.current) {
      // Find the marker for this group
      const markerIndex = studyGroups.findIndex(g => g.id === groupId);
      const marker = markers.current[markerIndex];
      
      // Close any existing popup
      if (activePopup.current) {
        activePopup.current.remove();
      }
      
      // Center the map on the location
      map.current.flyTo({
        center: group.coordinates,
        zoom: 16,
        duration: 1500
      });

      // Show the popup after the map animation
      setTimeout(() => {
        if (marker) {
          marker.togglePopup();
        }
      }, 1500);
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
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color={ACCENT} />
            </View>
          ) : (
            studyGroups.length > 0 ? (
              studyGroups.map((group) => (
                <View key={group.id} style={styles.cardWrapper}>
                  <StudyGroupCard
                    title={group.title}
                    subject={group.subject}
                    mood={group.mood}
                    time={group.time}
                    location={group.location}
                    description={group.description}
                    memberCount={group.memberCount}
                    users={group.members}
                    distance={group.distance}
                    coordinates={group.coordinates}
                  onPress={() => handleGroupPress(group.id)}
                    compact={true}
                  />
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No groups nearby</Text>
              </View>
            )
          )}
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
    paddingTop: 90, // Adjusted padding to 90px
  },
  cardsContainer: {
    height: CARD_HEIGHT,
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  cardsScrollContent: {
    paddingHorizontal: 10,
  },
  cardWrapper: {
    width: 280,
    marginRight: 10,
    height: CARD_HEIGHT,
  },
  loadingContainer: {
    height: CARD_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  emptyState: {
    height: CARD_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  emptyText: {
    color: '#999',
    fontSize: 14,
  },
  mapContainer: {
    flex: 1,
  }
}); 