import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';

const SAMPLE_SESSIONS = [
  {
    id: '1',
    title: 'CS 101 Study Group',
    location: 'Main Library',
    subject: 'Computer Science',
    time: '3:00 PM - 5:00 PM',
    attendees: 4,
  },
  {
    id: '2',
    title: 'Biology Final Prep',
    location: 'Science Building',
    subject: 'Biology',
    time: '4:30 PM - 6:30 PM',
    attendees: 6,
  },
  {
    id: '3',
    title: 'Calculus II Group',
    location: 'Math Building',
    subject: 'Mathematics',
    time: '2:00 PM - 4:00 PM',
    attendees: 5,
  },
];

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText type="title">Study Sessions</ThemedText>
        <TouchableOpacity
          style={[styles.createButton, { backgroundColor: colors.tint }]}
          onPress={() => console.log('Create session')}>
          <MaterialIcons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Session Cards */}
      <ScrollView style={styles.sessionsContainer} contentContainerStyle={styles.sessionsContent}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Nearby Study Sessions
        </ThemedText>
        {SAMPLE_SESSIONS.map((session) => (
          <TouchableOpacity
            key={session.id}
            style={[
              styles.sessionCard,
              { backgroundColor: colors.cardBackground },
              selectedSession === session.id && { borderColor: colors.tint },
            ]}
            onPress={() => setSelectedSession(session.id)}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <Image
                  source={{ uri: 'https://via.placeholder.com/40' }}
                  style={styles.hostAvatar}
                />
                <View>
                  <ThemedText type="subtitle">{session.title}</ThemedText>
                  <ThemedText type="caption" style={{ color: colors.icon }}>
                    {session.subject}
                  </ThemedText>
                </View>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={colors.icon} />
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.cardDetails}>
              <View style={styles.detailRow}>
                <MaterialIcons name="access-time" size={16} color={colors.icon} />
                <ThemedText type="caption" style={{ color: colors.icon }}>
                  {session.time}
                </ThemedText>
              </View>
              <View style={styles.detailRow}>
                <MaterialIcons name="location-on" size={16} color={colors.icon} />
                <ThemedText type="caption" style={{ color: colors.icon }}>
                  {session.location}
                </ThemedText>
              </View>
              <View style={styles.detailRow}>
                <MaterialIcons name="people" size={16} color={colors.icon} />
                <ThemedText type="caption" style={{ color: colors.icon }}>
                  {session.attendees} Attendees
                </ThemedText>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  createButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  sessionsContainer: {
    flex: 1,
  },
  sessionsContent: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  sessionCard: {
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  hostAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  cardDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
