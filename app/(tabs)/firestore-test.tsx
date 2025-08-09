import React, { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { ThemedView } from '../../components/ThemedView';
import { clearAllData } from '../../src/utils/clear-firestore';
import { migrateAllData } from '../../src/utils/migrate-mock-data';

export default function FirestoreTestScreen() {
  const [result, setResult] = useState<string>('');

  return (
    <ThemedView style={styles.container}>
      <Text style={styles.title}>Firestore Test</Text>

      <Pressable
        style={[styles.button, { backgroundColor: '#4CAF50' }]}
        onPress={async () => {
          try {
            setResult('Migrating mock data...');
            const ids = await migrateAllData();
            setResult(`Successfully migrated ${ids.length} study groups!`);
          } catch (error: any) {
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
          } catch (error: any) {
            setResult(`Error: ${error.message}`);
          }
        }}
      >
        <Text style={styles.buttonText}>Clear All Data</Text>
      </Pressable>

      <Text style={styles.result}>{result}</Text>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginVertical: 8,
    width: '100%',
    maxWidth: 300,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  result: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
  },
});
