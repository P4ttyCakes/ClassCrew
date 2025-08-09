import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { MOCK_MEMBERS, STUDY_GROUPS } from '../../data/studyGroups';
import { db } from '../config/firebase';

// Helper to generate mock user data
const majors = ['Computer Science', 'Business', 'Biology', 'Art', 'History', 'Engineering'];
const years = [1, 2, 3, 4];

// Upload all mock users to Firestore with the correct schema
export const migrateMockUsers = async () => {
  try {
    const usersRef = collection(db, 'users');
    const userPromises = MOCK_MEMBERS.map((member, idx) => {
      const userDoc = {
        id: member.id, // Ensure id field is present
        email: `${member.name.toLowerCase()}@example.com`,
        displayName: member.name,
        major: majors[idx % majors.length],
        year: years[idx % years.length],
        createdAt: new Date(),
        joinedGroups: [],
        profilePicture: member.profilePicture,
      };
      return setDoc(doc(usersRef, member.id), userDoc);
    });
    await Promise.all(userPromises);
    console.log(`Migrated ${MOCK_MEMBERS.length} users`);
    return MOCK_MEMBERS.map(m => m.id);
  } catch (error) {
    console.error('Error migrating users:', error);
    throw error;
  }
};

// Then migrate study groups
export const migrateMockStudyGroups = async () => {
  try {
    // First migrate users to get their IDs
    const userIds = await migrateMockUsers();
    const studyGroupsRef = collection(db, 'studyGroups');
    const groupPromises = STUDY_GROUPS.map(group => {
      // Store only user IDs in the group
      const firestoreGroup = {
        ...group,
        coordinates: {
          latitude: group.coordinates[1],
          longitude: group.coordinates[0]
        },
        createdAt: new Date(),
        startTime: new Date(),
        endTime: new Date(Date.now() + 7200000),
        status: 'active',
        users: group.members.map(m => m.id) // Only store user IDs
      };
      delete firestoreGroup.id;
      delete firestoreGroup.members;
      return addDoc(studyGroupsRef, firestoreGroup);
    });
    const groupDocs = await Promise.all(groupPromises);
    console.log(`Migrated ${groupDocs.length} study groups`);
    return groupDocs.map(doc => doc.id);
  } catch (error) {
    console.error('Error migrating study groups:', error);
    throw error;
  }
};

export const migrateAllData = async () => {
  try {
    const groupIds = await migrateMockStudyGroups();
    console.log('Migration completed successfully!');
    return groupIds;
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}; 