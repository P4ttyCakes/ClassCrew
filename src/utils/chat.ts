import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  where,
  Firestore,
  CollectionReference,
  DocumentReference,
} from 'firebase/firestore';
import { db } from '../config/firebase';

export type ChatMessageType = 'text' | 'image' | 'file';

export type Conversation = {
  id: string;
  memberIds: string[]; // includes creator and all participants
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  name?: string; // optional for group naming
  lastMessage?: {
    id?: string;
    senderId: string;
    type: ChatMessageType;
    text?: string;
    mediaUrl?: string;
    createdAt: Timestamp;
  };
};

export type Message = {
  id?: string;
  senderId: string;
  type: ChatMessageType;
  text?: string;
  mediaUrl?: string;
  createdAt: Timestamp;
};

// Deterministic 1:1 conversation id from two user ids
export function getOneToOneConversationId(userIdA: string, userIdB: string): string {
  const [first, second] = [userIdA, userIdB].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  return `dm_${first}_${second}`;
}

export function conversationsCollection(database: Firestore = db): CollectionReference {
  return collection(database, 'conversations');
}

export function conversationDoc(conversationId: string, database: Firestore = db): DocumentReference {
  return doc(database, 'conversations', conversationId);
}

export function messagesCollection(conversationId: string, database: Firestore = db): CollectionReference {
  return collection(database, 'conversations', conversationId, 'messages');
}

// Create or upsert a conversation document with fixed memberIds
export async function upsertConversation(params: {
  conversationId: string;
  memberIds: string[];
  createdBy: string;
  name?: string;
}) {
  const { conversationId, memberIds, createdBy, name } = params;
  const now = serverTimestamp();
  const ref = conversationDoc(conversationId);
  const payload: any = {
    memberIds: Array.from(new Set(memberIds)).sort(),
    createdBy,
    createdAt: now,
    updatedAt: now,
  };
  if (typeof name === 'string' && name.trim()) payload.name = name.trim();
  await setDoc(ref, payload, { merge: true });
  return ref;
}

// Send a message and update the conversation's lastMessage/updatedAt
export async function sendMessage(conversationId: string, message: Omit<Message, 'createdAt'>) {
  const createdAt = serverTimestamp() as unknown as Timestamp;
  const msgPayload: any = {
    senderId: message.senderId,
    type: message.type,
    createdAt,
  };
  if (message.text) msgPayload.text = message.text;
  if (message.mediaUrl) msgPayload.mediaUrl = message.mediaUrl;

  const msgs = messagesCollection(conversationId);
  const msgRef = await addDoc(msgs, msgPayload);

  const convRef = conversationDoc(conversationId);
  await setDoc(
    convRef,
    {
      lastMessage: {
        id: msgRef.id,
        senderId: message.senderId,
        type: message.type,
        text: message.text,
        mediaUrl: message.mediaUrl,
        createdAt,
      },
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  return msgRef;
}

// List a user's conversations ordered by most recent activity
export async function listUserConversations(userId: string, opts: { pageSize?: number } = {}) {
  const pageSize = opts.pageSize ?? 20;
  const q = query(
    conversationsCollection(),
    where('memberIds', 'array-contains', userId),
    orderBy('updatedAt', 'desc'),
    limit(pageSize)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as Conversation[];
}

// Subscribe to messages in a conversation ordered by creation time
export function subscribeToMessages(
  conversationId: string,
  onChange: (messages: Message[]) => void,
) {
  const q = query(messagesCollection(conversationId), orderBy('createdAt', 'asc'));
  return onSnapshot(q, (snapshot) => {
    const list = snapshot.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as Message[];
    onChange(list);
  });
}


