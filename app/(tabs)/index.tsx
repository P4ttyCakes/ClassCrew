import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { StudyGroupCard } from '../../components/study-groups/StudyGroupCard';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { Colors } from '../../constants/Colors';
import { STUDY_GROUPS } from '../../data/studyGroups';
import { useColorScheme } from '../../hooks/useColorScheme';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = SCREEN_WIDTH * 0.85; // 85% of screen width

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText type="title">Study Sessions</ThemedText>
      </View>

      {/* Session Cards */}
      <ScrollView 
        style={styles.sessionsContainer} 
        contentContainerStyle={styles.sessionsContent}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Nearby Study Sessions
        </ThemedText>
        <View style={styles.cardsContainer}>
          {STUDY_GROUPS.map((session) => (
            <View key={session.id} style={styles.cardWrapper}>
              <StudyGroupCard
                title={session.title}
                subject={session.subject}
                mood={session.mood}
                time={session.time}
                location={session.location}
                description={session.description}
                memberCount={session.memberCount}
                members={session.members}
                distance={session.distance}
                coordinates={session.coordinates}
                onPress={() => setSelectedSession(session.id)}
              />
            </View>
          ))}
        </View>
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
  sessionsContainer: {
    flex: 1,
  },
  sessionsContent: {
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 20,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  cardsContainer: {
    alignItems: 'center',
  },
  cardWrapper: {
    width: CARD_WIDTH,
    marginBottom: 20,
  }
});
