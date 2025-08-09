import { collection, deleteDoc, getDocs, query } from 'firebase/firestore';
import { db } from '../config/firebase';
import { events } from './events';

const clearCollection = async (collectionName: string) => {
  const q = query(collection(db, collectionName));
  const snapshot = await getDocs(q);
  let clearedCount = 0;
  for (const docRef of snapshot.docs) {
    await deleteDoc(docRef.ref);
    clearedCount++;
  }
  return clearedCount;
};

export const clearAllData = async () => {
  try {
    const usersCleared = await clearCollection('users');
    const groupsCleared = await clearCollection('studyGroups');
    console.log(`Cleared ${usersCleared} users and ${groupsCleared} study groups!`);
    events.emit('dataCleared');
    return {
      usersCleared,
      groupsCleared
    };
  } catch (error) {
    console.error('Error clearing data:', error);
    throw error;
  }
};