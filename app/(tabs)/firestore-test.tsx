import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { clearAllData } from '../../src/utils/clear-firestore';
import { createTestStudyGroup, getAllStudyGroups } from '../../src/utils/firestore-test';
import { migrateAllData } from '../../src/utils/migrate-mock-data';

export default function FirestoreTestScreen() {
  const [result, setResult] = useState<string>('');

  const handleCreateGroup = async () => {
    try {
      const groupId = await createTestStudyGroup();
      setResult(`Successfully created group with ID: ${groupId}`);
    } catch (error) {
      setResult(`Error: ${error.message}`);
    }
  };

  const handleFetchGroups = async () => {
    try {
      const groups = await getAllStudyGroups();
      setResult(`Fetched ${groups.length} groups. Check console for details.`);
    } catch (error) {
      setResult(`Error: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Firestore Test</Text>
      
      <Pressable style={styles.button} onPress={handleCreateGroup}>
        <Text style={styles.buttonText}>Create Test Study Group</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={handleFetchGroups}>
        <Text style={styles.buttonText}>Fetch All Groups</Text>
      </Pressable>

      <Pressable 
        style={[styles.button, { backgroundColor: '#4CAF50' }]} 
        onPress={async () => {
          try {
            setResult('Migrating mock data...');
            const ids = await migrateAllData();
            setResult(`Successfully migrated ${ids.length} study groups!`);
          } catch (error) {
            setResult(`Error: ${error.message}`);
          }
        }}
      >
        <Text style={styles.buttonText}>Migrate Mock Data</Text>
      </Pressable>

      <Pressable 
        style={[styles.button, { backgroundColor: '#FF4444' }]} 
        onPress={async () => {
          try {
            setResult('Clearing all data...');
            const { usersCleared, groupsCleared } = await clearAllData();
            setResult(`Cleared ${usersCleared} users and ${groupsCleared} study groups!`);
          } catch (error) {
            setResult(`Error: ${error.message}`);
          }
        }}
      >
        <Text style={styles.buttonText}>Clear All Data</Text>
      </Pressable>

      <Text style={styles.result}>{result}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#242428',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  button: {
    backgroundColor: 'rgb(91, 134, 197)',
    padding: 15,
    borderRadius: 30,
    width: '80%',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  result: {
    marginTop: 20,
    color: '#fff',
    textAlign: 'center',
  },
}); 