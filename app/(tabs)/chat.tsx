import React from 'react';
import { View } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';

export default function ChatScreen() {
  return (
    <ThemedView style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ThemedText>Chat Screen Coming Soon</ThemedText>
      </View>
    </ThemedView>
  );
} 