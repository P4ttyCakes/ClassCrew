import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { Alert, Button, Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { StudyGroupCard } from '../../components/study-groups/StudyGroupCard';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { Colors } from '../../constants/Colors';
import { STUDY_GROUPS } from '../../data/studyGroups';
import { useColorScheme } from '../../hooks/useColorScheme';
import { app } from '../../src/config/firebase';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = SCREEN_WIDTH * 0.85; // 85% of screen width

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  // Firebase test function
  const testFirebaseAuth = async () => {
    const auth = getAuth(app);
    const email = 'superpandalu@gmail.com';
    const password = 'testPassword';
    try {
      // Try to create the user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User created:', userCredential.user);
      Alert.alert('Firebase', 'User created: ' + userCredential.user.email);
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        // If already exists, try to sign in
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          console.log('Signed in:', userCredential.user);
          Alert.alert('Firebase', 'Signed in: ' + userCredential.user.email);
        } catch (signInError: any) {
          console.error('Sign in error:', signInError);
          Alert.alert('Firebase', 'Sign in error: ' + signInError.message);
        }
      } else {
        console.error('Error creating user:', error);
        Alert.alert('Firebase', 'Error: ' + error.message);
      }
    }
    // Log current user
    console.log('Current user:', auth.currentUser);
  };

  return (
    <ThemedView style={styles.container}>
      {/* Firebase Test Button */}
      <View style={{ padding: 20 }}>
        <Button title="Test Firebase Auth" onPress={testFirebaseAuth} />
      </View>
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
