import { collection, doc, getDoc, onSnapshot, query } from 'firebase/firestore';
import { Member, StudyGroup } from '../../data/studyGroups';
import { db } from '../config/firebase';

// Convert Firestore data to our StudyGroup type
const convertFirestoreGroup = (doc: any): StudyGroup => {
  const data = doc.data();

  // Normalize coordinates: accept [lng, lat] or { longitude, latitude }
  let coordinates: [number, number] | undefined = undefined;
  const raw = data.coordinates;
  if (Array.isArray(raw) && raw.length === 2) {
    coordinates = [raw[0], raw[1]];
  } else if (raw && typeof raw === 'object' && 'longitude' in raw && 'latitude' in raw) {
    coordinates = [raw.longitude, raw.latitude];
  }

  return {
    id: doc.id,
    title: data.title,
    subject: data.subject,
    mood: data.mood,
    time: data.time,
    location: data.location,
    description: data.description,
    memberCount: data.memberCount,
    members: [], // We'll populate this with user data
    distance: data.distance,
    coordinates: coordinates as [number, number],
    // Also include Firestore user IDs to allow hydration in screens
    ...(data.users ? { users: data.users } : {})
  } as any;
};

// Function to fetch user details by their IDs
export const fetchUsersByIds = async (ids: string[]): Promise<Member[]> => {
  if (!ids || ids.length === 0) return [];
  const results: Member[] = [];

  for (const id of ids) {
    const userDoc = await getDoc(doc(db, 'users', id));
    if (userDoc.exists()) {
      const data = userDoc.data();
      results.push({
        id: data.id,
        name: data.displayName,
        profilePicture: data.profilePicture
      });
    }
  }

  return results;
};

// Subscribe to real-time study group updates
export const subscribeToStudyGroups = (
  onUpdate: (groups: StudyGroup[]) => void,
  onError: (error: Error) => void
) => {
  const q = query(collection(db, 'studyGroups'));
  return onSnapshot(
    q,
    async (snapshot) => {
      try {
        const groups = await Promise.all(
          snapshot.docs.map(async (doc) => {
            const group = convertFirestoreGroup(doc);
            const data = doc.data();
            // Fetch member details for each user ID
            group.members = await fetchUsersByIds(data.users || []);
            return group;
          })
        );
        onUpdate(groups);
      } catch (error) {
        onError(error as Error);
      }
    },
    onError
  );
};