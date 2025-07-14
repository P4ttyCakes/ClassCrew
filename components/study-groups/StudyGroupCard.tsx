import { LinearGradient } from 'expo-linear-gradient';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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

const moodIcons = {
  focused: '📚',
  casual: '☕',
  exam_prep: '🎯',
  project: '👥',
  review: '📝',
  homework: '✏️'
};

type StudyGroupCardProps = {
  title: string;
  subject: keyof typeof subjectGradients;
  mood: keyof typeof moodIcons;
  time: string;
  location: string;
  memberCount: number;
  distance: string;
  coordinates: [number, number]; // [longitude, latitude]
  onPress: () => void;
};

export const StudyGroupCard: React.FC<StudyGroupCardProps> = ({
  title,
  subject,
  mood,
  time,
  location,
  memberCount,
  distance,
  coordinates,
  onPress
}) => {
  const mapContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (Platform.OS === 'web' && mapContainerRef.current) {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: coordinates,
        zoom: 15,
        interactive: false
      });

      new mapboxgl.Marker()
        .setLngLat(coordinates)
        .addTo(map);

      return () => map.remove();
    }
  }, [coordinates]);

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <LinearGradient
        colors={subjectGradients[subject]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.moodBadge}>
              <Text>{moodIcons[mood]}</Text>
              <Text style={styles.moodText}>
                {mood.split('_').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </Text>
            </View>
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.metadata}>{time} • {distance}</Text>

          <View style={styles.footer}>
            <Text style={styles.location}>{location}</Text>
            <View style={styles.memberCount}>
              <Text style={styles.memberText}>{memberCount} members</Text>
            </View>
          </View>
        </View>

        {/* Map Container */}
        <View style={styles.mapContainer}>
          {Platform.OS === 'web' && (
            <div ref={mapContainerRef} style={styles.miniMap} />
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  gradient: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  moodText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: 'white',
    marginVertical: 8,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  metadata: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  location: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    flex: 1,
  },
  memberCount: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  memberText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
  mapContainer: {
    height: 250,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  miniMap: {
    width: '100%',
    height: '100%',
  }
}); 