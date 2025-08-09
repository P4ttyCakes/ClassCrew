import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { StudyGroupCard } from '../../components/study-groups/StudyGroupCard';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { Colors } from '../../constants/Colors';
import { StudyGroup } from '../../data/studyGroups';
import { useColorScheme } from '../../hooks/useColorScheme';
import { fetchUsersByIds, subscribeToStudyGroups } from '../../src/utils/study-groups';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = SCREEN_WIDTH * 0.85; // 85% of screen width

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch groups in real-time
  useEffect(() => {
    const unsubscribe = subscribeToStudyGroups(
      (groups) => {
        setStudyGroups(groups);
        setLoading(false);
      },
      (error) => {
        setError(error.message);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Fetch member details for each group
  const [groupsWithUsers, setGroupsWithUsers] = useState<StudyGroup[]>([]);
  useEffect(() => {
    async function fetchAllUsers() {
      setLoading(true);
      try {
        const updatedGroups = await Promise.all(
          studyGroups.map(async (group) => {
            // group.users is an array of user IDs
            const users = await fetchUsersByIds(Array.isArray(group.users) ? group.users : []);
            return { ...group, users };
          })
        );
        setGroupsWithUsers(updatedGroups);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    }
    if (studyGroups.length) fetchAllUsers();
    else setGroupsWithUsers([]);
  }, [studyGroups]);

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
        <View>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Nearby Study Sessions
          </ThemedText>
          {loading ? (
            <ActivityIndicator size="large" color={Colors[colorScheme].text} style={styles.loader} />
          ) : error ? (
            <ThemedText style={styles.errorText}>{error}</ThemedText>
          ) : (
            <View style={styles.cardsContainer}>
              {Array.isArray(groupsWithUsers) && groupsWithUsers.map((session) => {
                console.log('Rendering group:', session.title, 'users:', session.users);
                return (
                  <View key={session.id} style={styles.cardWrapper}>
                    <StudyGroupCard
                      title={session.title}
                      subject={session.subject}
                      mood={session.mood}
                      time={session.time}
                      location={session.location}
                      description={session.description}
                      memberCount={session.memberCount}
                      users={session.users}
                      distance={session.distance}
                      coordinates={session.coordinates}
                      onPress={() => setSelectedSession(session.id)}
                    />
                  </View>
                );
              })}
            </View>
          )}
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
  },
  loader: {
    marginTop: 20,
  },
  errorText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#FF4444',
  },
});
