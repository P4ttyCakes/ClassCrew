import { LinearGradient } from 'expo-linear-gradient';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getEmojiForSubject, getThemeForString } from '../../src/constants/subjects';

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

const moodLabels = {
  focused: 'Focused',
  casual: 'Casual',
  exam_prep: 'Exam Prep',
  project: 'Project',
  review: 'Review',
  homework: 'Homework'
};

type StudyGroupCardProps = {
  title: string;
  subject: keyof typeof subjectGradients;
  mood: keyof typeof moodIcons;
  time: string;
  location: string;
  description?: string;
  memberCount: number;
  users: Array<{ id: string; name?: string; displayName?: string; profilePicture?: string }>;
  distance: string;
  coordinates: [number, number];
  class: string;
  onPress: () => void;
  compact?: boolean;
};

export const StudyGroupCard: React.FC<StudyGroupCardProps> = ({
  title,
  subject,
  mood,
  time,
  location,
  description,
  memberCount,
  users = [],
  distance,
  coordinates,
  class: department,
  onPress,
  compact = false
}) => {
  const mapContainerRef = React.useRef<HTMLDivElement>(null);

  // Keep the existing map logic for non-compact mode
  React.useEffect(() => {
    if (!compact && Platform.OS === 'web' && mapContainerRef.current) {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: coordinates,
        zoom: 16.5,
        interactive: true
      });

      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <h3>${title}</h3>
          <p>${location}</p>
          <p>${time}</p>
          <p>${memberCount} members</p>
        `);

      const markerColor = theme.tint;
      new mapboxgl.Marker({ color: markerColor })
        .setLngLat(coordinates)
        .setPopup(popup)
        .addTo(map);

      map.addControl(new mapboxgl.NavigationControl(), 'top-right');

      return () => map.remove();
    }
  }, [compact, coordinates, title, location, time, memberCount]);

  const renderUserPictures = () => {
    const displayCount = 5;
    console.log('User pictures:', users);
    const visibleUsers = Array.isArray(users) ? users.slice(0, displayCount) : [];
    const remainingCount = Array.isArray(users) ? users.length - displayCount : 0;
    return (
      <View style={styles.memberPictures}>
        {visibleUsers.map((user, index) => (
          <View
            key={user.id}
            style={[
              styles.memberPictureContainer,
              { marginLeft: index > 0 ? -8 : 0 }
            ]}
          >
            {user.profilePicture ? (
              <Image
                source={{ uri: user.profilePicture }}
                style={styles.memberPicture}
              />
            ) : (
              <View style={[styles.memberPicture, { backgroundColor: '#ccc' }]} />
            )}
          </View>
        ))}
        {remainingCount > 0 && (
          <View style={styles.remainingCount}>
            <Text style={styles.remainingCountText}>
              +{remainingCount}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const theme = getThemeForString(department || title);

  if (compact) {
    return (
      <TouchableOpacity onPress={onPress} style={styles.compactContainer}>
        <LinearGradient
          colors={theme.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.compactGradient}
        >
          <View style={styles.compactContent}>
            <View style={styles.compactHeader}>
              <Text style={styles.compactTitle} numberOfLines={1}>
                {title}
              </Text>
            </View>
            
            <View style={styles.compactFooter}>
              <Text style={styles.compactLocation} numberOfLines={1}>
                {location}
              </Text>
              <View style={styles.compactMoodLabel}>
                <Text style={styles.compactMoodText}>
                  {moodIcons[mood]} {moodLabels[mood]}
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  // Keep existing non-compact card render logic
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <LinearGradient
        colors={theme.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={1}>
              {getEmojiForSubject(department || subject)} {title}
            </Text>
            {!!department && (
              <View style={[styles.classTag, { borderColor: 'rgba(255,255,255,0.6)', backgroundColor: 'rgba(0,0,0,0.2)' }]}>
                <Text style={styles.classTagText}>{department}</Text>
              </View>
            )}
          </View>

          <View style={styles.metadata}>
            <Text style={styles.metadataText}>{time} • {distance}</Text>
            <View style={styles.moodLabel}>
              <Text style={styles.moodText}>
                {moodIcons[mood]} {moodLabels[mood]}
              </Text>
            </View>
          </View>

          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionText} numberOfLines={2}>
              {description}
            </Text>
          </View>

          <View style={styles.footer}>
            <View style={styles.footerLeft}>
              <Text style={styles.location} numberOfLines={1}>{location}</Text>
              {renderUserPictures()}
            </View>
          </View>
        </View>

        {Platform.OS === 'web' && (
          <View style={styles.mapContainer}>
            <div 
              ref={mapContainerRef} 
              style={styles.miniMap} 
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            />
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Compact styles
  compactContainer: {
    borderRadius: 12,
    marginVertical: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    overflow: 'hidden',
  },
  compactGradient: {
    height: 80,
  },
  compactContent: {
    padding: 12,
    height: '100%',
    gap: 4, // Add small gap between header and footer
  },
  compactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    flex: 1,
  },
  compactFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  compactLocation: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
  },
  compactMoodLabel: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  compactMoodText: {
    fontSize: 13,
    color: 'white',
    fontWeight: '600',
  },

  // Non-compact styles
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
    alignItems: 'center',
    marginBottom: 8,
  },
  classTag: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
  },
  classTagText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: 'white',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    flex: 1,
  },
  metadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metadataText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  moodLabel: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 18,
  },
  moodText: {
    fontSize: 15,
    color: 'white',
    fontWeight: '600',
  },
  descriptionContainer: {
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLeft: {
    flex: 1,
    gap: 8,
  },
  location: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
  },
  memberPictures: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberPictureContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'white',
    overflow: 'hidden',
  },
  memberPicture: {
    width: '100%',
    height: '100%',
  },
  remainingCount: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -8,
    borderWidth: 2,
    borderColor: 'white',
  },
  remainingCountText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
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