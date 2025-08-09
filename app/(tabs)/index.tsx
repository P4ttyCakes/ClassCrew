import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { StudyGroupCard } from '../../components/study-groups/StudyGroupCard';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { Colors } from '../../constants/Colors';
import { StudyGroup } from '../../data/studyGroups';
import { useColorScheme } from '../../hooks/useColorScheme';
import { events } from '../../src/utils/events';
import { fetchUsersByIds, subscribeToStudyGroups } from '../../src/utils/study-groups';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = SCREEN_WIDTH * 0.85; // 85% of screen width
const ACCENT = 'rgb(91, 134, 197)';

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch groups in real-time
  useEffect(() => {
    const unsubscribe = subscribeToStudyGroups(
      (groups) => {
        // Deduplicate and keep only groups with valid coordinates for consistency
        const seen = new Set<string>();
        const unique = groups.filter((g: any) => {
          if (!g || !g.id) return false;
          if (seen.has(g.id)) return false;
          seen.add(g.id);
          const c = g.coordinates as any;
          const valid = Array.isArray(c) && c.length === 2 && isFinite(c[0]) && isFinite(c[1]);
          return valid;
        });
        setStudyGroups(unique as any);
        // keep loading true until user hydration finishes
      },
      (error) => {
        setError(error.message);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [refreshKey]);

  // Listen for clear-all event to refresh subscription and clear UI immediately
  useEffect(() => {
    const unsub = events.subscribe('dataCleared', () => {
      setGroupsWithUsers([]);
      setStudyGroups([]);
      setLoading(true); // show spinner until subscription resolves
      setRefreshKey((k) => k + 1);
    });
    return () => unsub();
  }, []);

  // Fetch member details for each group
  const [groupsWithUsers, setGroupsWithUsers] = useState<StudyGroup[]>([]);
  useEffect(() => {
    let cancelled = false;
    async function fetchAllUsers() {
      setLoading(true);
      try {
        const updatedGroups = await Promise.all(
          studyGroups.map(async (group) => {
            const userIds = (group as any).users as string[] | undefined;
            const users = await fetchUsersByIds(Array.isArray(userIds) ? userIds : []);
            // Back-compat: also set members so SGC can read avatars consistently
            return { ...(group as any), users, members: users } as any;
          })
        );
        if (cancelled) return;
        setGroupsWithUsers(updatedGroups as any);
        setLoading(false);
      } catch (err: any) {
        if (cancelled) return;
        setError(err.message);
        setLoading(false);
      }
    }
    if (studyGroups.length) fetchAllUsers();
    else {
      setGroupsWithUsers([]);
      setLoading(false);
    }
    return () => {
      cancelled = true;
    };
  }, [studyGroups]);

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText type="title">Study Sessions</ThemedText>
      </View>
      {/* Session Cards */}
      <ScrollView 
        key={refreshKey}
        style={styles.sessionsContainer} 
        contentContainerStyle={styles.sessionsContent}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Nearby Study Sessions
          </ThemedText>
          {loading ? (
            <ActivityIndicator size="large" color={ACCENT} style={styles.loader} />
          ) : error ? (
            <ThemedText style={styles.errorText}>{error}</ThemedText>
          ) : (
            <View style={styles.cardsContainer}>
              {Array.isArray(groupsWithUsers) && groupsWithUsers.map((session: any) => {
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
                      users={session.users ?? (session as any).members ?? []}
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
