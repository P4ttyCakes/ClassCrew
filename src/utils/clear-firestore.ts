import { deleteUser, getAuth, signOut } from 'firebase/auth';
import { collection, deleteDoc, getDocs, query } from 'firebase/firestore';
import { deleteObject, listAll, ref } from 'firebase/storage';
import { db, storage } from '../config/firebase';
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
    // Clear Storage under users/
    const { filesDeleted } = await clearStorageUsersFolder();
    // Try to delete current auth user (client cannot delete arbitrary users)
    const { currentUserDeleted } = await clearCurrentAuthUser();
    console.log(`Cleared ${usersCleared} users, ${groupsCleared} study groups, deleted ${filesDeleted} storage files, auth current user deleted: ${currentUserDeleted}`);
    events.emit('dataCleared');
    return {
      usersCleared,
      groupsCleared,
      filesDeleted,
      currentUserDeleted
    };
  } catch (error) {
    console.error('Error clearing data:', error);
    throw error;
  }
};

const clearStorageUsersFolder = async () => {
  const root = ref(storage, 'users');
  let filesDeleted = 0;
  const walk = async (folder: ReturnType<typeof ref>) => {
    const listing = await listAll(folder);
    for (const item of listing.items) {
      await deleteObject(item);
      filesDeleted++;
    }
    for (const prefix of listing.prefixes) {
      await walk(prefix);
    }
  };
  try {
    await walk(root);
  } catch (e) {
    // ignore
  }
  return { filesDeleted };
};

const clearCurrentAuthUser = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) return { currentUserDeleted: false };
  try {
    await deleteUser(user);
    return { currentUserDeleted: true };
  } catch (e) {
    try { await signOut(auth); } catch {}
    return { currentUserDeleted: false };
  }
};