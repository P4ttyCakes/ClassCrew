import { collection, deleteDoc, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

export const clearCollection = async (collectionName: string) => {
  try {
    const collectionRef = collection(db, collectionName);
    const snapshot = await getDocs(collectionRef);
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    console.log(`Cleared ${snapshot.docs.length} documents from ${collectionName}`);
    return snapshot.docs.length;
  } catch (error) {
    console.error(`Error clearing ${collectionName}:`, error);
    throw error;
  }
};

export const clearAllData = async () => {
  try {
    const usersCleared = await clearCollection('users');
    const groupsCleared = await clearCollection('studyGroups');
    console.log(`Cleared ${usersCleared} users and ${groupsCleared} study groups!`);
    return {
      usersCleared,
      groupsCleared
    };
  } catch (error) {
    console.error('Error clearing data:', error);
    throw error;
  }
}; 