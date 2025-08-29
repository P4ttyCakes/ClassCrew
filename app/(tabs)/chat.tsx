import { getAuth } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';
import { 
  Conversation, 
  Message, 
  getOneToOneConversationId, 
  listUserConversations, 
  sendMessage, 
  subscribeToMessages, 
  upsertConversation 
} from '../../src/utils/chat';

export default function ChatScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const auth = getAuth();
  const currentUserId = auth.currentUser?.uid;

  // Load user's conversations
  useEffect(() => {
    if (!currentUserId) return;
    
    const loadConversations = async () => {
      try {
        const convos = await listUserConversations(currentUserId);
        setConversations(convos);
      } catch (error) {
        console.error('Failed to load conversations:', error);
        Alert.alert('Error', 'Failed to load conversations');
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, [currentUserId]);

  // Subscribe to messages when a conversation is selected
  useEffect(() => {
    if (!selectedConversation) return;

    const unsubscribe = subscribeToMessages(selectedConversation.id, (newMessages) => {
      setMessages(newMessages);
    });

    return unsubscribe;
  }, [selectedConversation]);

  const handleStartChat = async () => {
    if (!currentUserId) return;
    
    // For demo: create a chat with a mock user
    const mockUserId = 'demo_user_123';
    const conversationId = getOneToOneConversationId(currentUserId, mockUserId);
    
    try {
      await upsertConversation({
        conversationId,
        memberIds: [currentUserId, mockUserId],
        createdBy: currentUserId,
      });
      
      // Reload conversations
      const convos = await listUserConversations(currentUserId);
      setConversations(convos);
      
      Alert.alert('Success', 'Demo conversation created!');
    } catch (error) {
      console.error('Failed to create conversation:', error);
      Alert.alert('Error', 'Failed to create conversation');
    }
  };

  const handleSendMessage = async () => {
    if (!selectedConversation || !currentUserId || !newMessage.trim()) return;

    try {
      await sendMessage(selectedConversation.id, {
        senderId: currentUserId,
        type: 'text',
        text: newMessage.trim(),
      });
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
      Alert.alert('Error', 'Failed to send message');
    }
  };

  const renderConversation = ({ item }: { item: Conversation }) => (
    <Pressable
      style={[styles.conversationItem, { backgroundColor: colors.cardBackground }]}
      onPress={() => setSelectedConversation(item)}
    >
      <ThemedText style={styles.conversationName}>
        {item.name || `Chat with ${item.memberIds.filter(id => id !== currentUserId).length} user(s)`}
      </ThemedText>
      {item.lastMessage && (
        <ThemedText style={[styles.lastMessage, { color: colors.icon }]}>
          {item.lastMessage.text || 'Media message'}
        </ThemedText>
      )}
    </Pressable>
  );

  const renderMessage = ({ item }: { item: Message }) => {
    const isOwn = item.senderId === currentUserId;
    return (
      <View style={[styles.messageContainer, isOwn ? styles.ownMessage : styles.otherMessage]}>
        <ThemedText style={[styles.messageText, { color: isOwn ? '#fff' : colors.text }]}>
          {item.text}
        </ThemedText>
        <ThemedText style={[styles.messageTime, { color: isOwn ? '#fff' : colors.icon }]}>
          {item.createdAt?.toDate?.()?.toLocaleTimeString() || 'Now'}
        </ThemedText>
      </View>
    );
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading conversations...</ThemedText>
      </ThemedView>
    );
  }

  if (selectedConversation) {
    return (
      <ThemedView style={styles.container}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Pressable onPress={() => setSelectedConversation(null)}>
            <ThemedText style={{ color: colors.tint }}>← Back</ThemedText>
          </Pressable>
          <ThemedText style={styles.headerTitle}>
            {selectedConversation.name || 'Chat'}
          </ThemedText>
        </View>

        <FlatList
          data={messages}
          keyExtractor={(item) => item.id || Math.random().toString()}
          renderItem={renderMessage}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
        />

        <View style={[styles.inputContainer, { borderTopColor: colors.border }]}>
          <TextInput
            style={[styles.textInput, { color: colors.text, borderColor: colors.border }]}
            placeholder="Type a message..."
            placeholderTextColor={colors.icon}
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
          />
          <Pressable
            style={[styles.sendButton, { backgroundColor: colors.tint }]}
            onPress={handleSendMessage}
          >
            <ThemedText style={{ color: '#fff', fontWeight: 'bold' }}>Send</ThemedText>
          </Pressable>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Chat</ThemedText>
        <Pressable
          style={[styles.startChatButton, { backgroundColor: colors.tint }]}
          onPress={handleStartChat}
        >
          <ThemedText style={{ color: '#fff', fontWeight: 'bold' }}>Start Demo Chat</ThemedText>
        </Pressable>
      </View>

      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={renderConversation}
        style={styles.conversationsList}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <ThemedText style={[styles.emptyText, { color: colors.icon }]}>
              No conversations yet. Start a demo chat to see how it works!
            </ThemedText>
          </View>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  startChatButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  conversationsList: {
    flex: 1,
  },
  conversationItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  conversationName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  ownMessage: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: '#f0f0f0',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 12,
    opacity: 0.7,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    maxHeight: 100,
  },
  sendButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
}); 