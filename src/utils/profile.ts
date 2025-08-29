import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '../config/firebase';

export type EditableUserProfile = {
  displayName: string;
  username?: string;
  profilePicture?: string;
  classes: string[];
};

export async function fetchUserProfile(uid: string) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
}

export async function uploadProfileImage(uid: string, file: Blob | File): Promise<string> {
  const fileRef = ref(storage, `users/${uid}/profile.jpg`);
  await uploadBytes(fileRef, file);
  return await getDownloadURL(fileRef);
}

export async function saveUserProfile(uid: string, data: EditableUserProfile) {
  const payload: any = {
    displayName: data.displayName,
    classes: Array.isArray(data.classes) ? data.classes : [],
    profileComplete: true,
    updatedAt: serverTimestamp(),
  };
  if (typeof data.username === 'string' && data.username.trim()) {
    payload.username = data.username.trim();
  }
  if (data.profilePicture) {
    payload.profilePicture = data.profilePicture;
  }
  await setDoc(doc(db, 'users', uid), payload, { merge: true });
}

