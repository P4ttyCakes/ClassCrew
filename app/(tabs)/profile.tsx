import React from 'react';
import { View, ScrollView, Image, StyleSheet } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';

const MOCK_USER = {
  name: 'John Doe',
  major: 'Computer Science',
  year: 'Junior',
  profilePic: 'https://picsum.photos/200',
  classes: [
    { id: '1', name: 'Data Structures', code: 'CS 261' },
    { id: '2', name: 'Algorithms', code: 'CS 325' },
    { id: '3', name: 'Operating Systems', code: 'CS 344' },
  ],
  studyHistory: [
    {
      id: '1',
      name: 'Algorithm Analysis Study Group',
      date: '2024-03-15',
      duration: '2h',
      participants: 4,
    },
    {
      id: '2',
      name: 'OS Project Discussion',
      date: '2024-03-12',
      duration: '1.5h',
      participants: 3,
    },
    {
      id: '3',
      name: 'Data Structures Review',
      date: '2024-03-10',
      duration: '2.5h',
      participants: 5,
    },
  ],
};

const ProfileSection = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  return (
    <View style={styles.section}>
      <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>{title}</ThemedText>
      {children}
    </View>
  );
};

const ClassItem = ({ name, code }: { name: string; code: string }) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  return (
    <ThemedView style={[styles.itemContainer, { backgroundColor: colors.cardBackground }]}>
      <Ionicons name="book-outline" size={24} color={colors.tint} />
      <View style={styles.itemTextContainer}>
        <ThemedText style={styles.itemTitle}>{name}</ThemedText>
        <ThemedText style={[styles.itemSubtitle, { color: colors.icon }]}>{code}</ThemedText>
      </View>
    </ThemedView>
  );
};

const HistoryItem = ({ name, date, duration, participants }: {
  name: string;
  date: string;
  duration: string;
  participants: number;
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  return (
    <ThemedView style={[styles.itemContainer, { backgroundColor: colors.cardBackground }]}>
      <Ionicons name="people-outline" size={24} color={colors.tint} />
      <View style={styles.itemTextContainer}>
        <ThemedText style={styles.itemTitle}>{name}</ThemedText>
        <ThemedText style={[styles.itemSubtitle, { color: colors.icon }]}>
          {new Date(date).toLocaleDateString()} • {duration} • {participants} participants
        </ThemedText>
      </View>
    </ThemedView>
  );
};

export default function ProfileScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Image
            source={{ uri: MOCK_USER.profilePic }}
            style={styles.profilePic}
          />
          <View style={styles.userInfo}>
            <ThemedText style={styles.name}>{MOCK_USER.name}</ThemedText>
            <ThemedText style={[styles.details, { color: colors.icon }]}>
              {MOCK_USER.major} • {MOCK_USER.year}
            </ThemedText>
          </View>
        </View>

        <ProfileSection title="Current Classes">
          {MOCK_USER.classes.map((cls) => (
            <ClassItem key={cls.id} name={cls.name} code={cls.code} />
          ))}
        </ProfileSection>

        <ProfileSection title="Study Group History">
          {MOCK_USER.studyHistory.map((session) => (
            <HistoryItem
              key={session.id}
              name={session.name}
              date={session.date}
              duration={session.duration}
              participants={session.participants}
            />
          ))}
        </ProfileSection>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  userInfo: {
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  details: {
    fontSize: 16,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  itemTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 14,
  },
}); 