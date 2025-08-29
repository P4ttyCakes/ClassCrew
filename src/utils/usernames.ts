import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export async function lookupUsername(username: string): Promise<{ uid: string } | null> {
  const key = username.trim().toLowerCase();
  if (!key) return null;
  const snap = await getDoc(doc(db, 'usernames', key));
  return snap.exists() ? (snap.data() as any) : null;
}

// Try to claim a username for a uid. Returns true if claimed or already owned by uid, false if taken.
export async function claimUsername(uid: string, username: string): Promise<boolean> {
  const key = username.trim().toLowerCase();
  if (!key) return false;
  const ref = doc(db, 'usernames', key);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    const data = snap.data() as any;
    return data.uid === uid; // already owned
  }
  await setDoc(ref, { uid });
  return true;
}



