import React from 'react';
import { StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { StudyGroupCard } from './src/components/study-groups/StudyGroupCard';

const sampleGroups = [
  {
    id: '1',
    title: 'Calculus II Study Session',
    subject: 'math',
    mood: 'focused',
    time: 'Today, 3:00 PM',
    location: 'Main Library, Floor 2',
    memberCount: 4,
    distance: '5 min walk'
  },
  {
    id: '2',
    title: 'English Literature Discussion',
    subject: 'english',
    mood: 'casual',
    time: 'Today, 4:30 PM',
    location: 'Campus Coffee Shop',
    memberCount: 6,
    distance: '10 min walk'
  },
  {
    id: '3',
    title: 'Physics Final Prep',
    subject: 'science',
    mood: 'exam_prep',
    time: 'Tomorrow, 2:00 PM',
    location: 'Science Building, Room 302',
    memberCount: 8,
    distance: '15 min walk'
  }
] as const;

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {sampleGroups.map(group => (
          <StudyGroupCard
            key={group.id}
            {...group}
            onPress={() => console.log('Pressed:', group.id)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF6E3',
  },
  content: {
    padding: 16,
  },
}); 