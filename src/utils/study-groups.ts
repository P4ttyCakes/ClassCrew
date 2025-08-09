import { collection, DocumentData, getDocs, onSnapshot, query, QuerySnapshot, where } from 'firebase/firestore';
import { Member, StudyGroup } from '../../data/studyGroups';
import { db } from '../config/firebase';

// Convert Firestore data to our StudyGroup type
const convertFirestoreGroup = (doc: DocumentData): StudyGroup => {
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title,
    subject: data.subject,
    mood: data.mood,
    time: data.time,
    location: data.location,
    description: data.description,
    memberCount: data.memberCount,
    users: data.users || [], // will be replaced with full objects later
    distance: data.distance,
    coordinates: [data.coordinates.longitude, data.coordinates.latitude]
  };
};

// Fetch user details for an array of IDs
export const fetchUsersByIds = async (ids: string[]): Promise<Member[]> => {
  if (!ids.length) return [];
  const usersRef = collection(db, 'users');
  // Firestore 'in' queries are limited to 10 items per query
  const chunks = [];
  for (let i = 0; i < ids.length; i += 10) {
    chunks.push(ids.slice(i, i + 10));
  }
  const results: Member[] = [];
  for (const chunk of chunks) {
    const q = query(usersRef, where('id', 'in', chunk));
    const snapshot = await getDocs(q);
    snapshot.forEach(doc => results.push(doc.data() as Member));
  }
  return results;
};

// Subscribe to real-time updates
export const subscribeToStudyGroups = (
  onUpdate: (groups: StudyGroup[]) => void,
  onError: (error: Error) => void
) => {
  const studyGroupsRef = collection(db, 'studyGroups');
  const q = query(studyGroupsRef);
  return onSnapshot(
    q,
    (snapshot: QuerySnapshot) => {
      const groups = snapshot.docs.map(convertFirestoreGroup);
      onUpdate(groups || []);
    },
    onError
  );
}; 