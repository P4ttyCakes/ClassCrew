import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { Member, STUDY_GROUPS } from '../../data/studyGroups';
import { db } from '../config/firebase';

const MOCK_USERS: Member[] = [
  { id: '1', name: 'Alex', profilePicture: 'https://i.pravatar.cc/150?img=1' },
  { id: '2', name: 'Jordan', profilePicture: 'https://i.pravatar.cc/150?img=2' },
  { id: '3', name: 'Taylor', profilePicture: 'https://i.pravatar.cc/150?img=3' },
  { id: '4', name: 'Morgan', profilePicture: 'https://i.pravatar.cc/150?img=4' },
  { id: '5', name: 'Casey', profilePicture: 'https://i.pravatar.cc/150?img=5' },
  { id: '6', name: 'Sam', profilePicture: 'https://i.pravatar.cc/150?img=6' }
];

export const migrateMockUsers = async () => {
  try {
    const usersRef = collection(db, 'users');
    const userPromises = MOCK_USERS.map((member: Member) => {
      const userDoc = {
        id: member.id,
        displayName: member.name,
        profilePicture: member.profilePicture,
        email: `${member.name.toLowerCase()}@example.com`,
        major: ['CS', 'Math', 'Physics', 'English'][Math.floor(Math.random() * 4)],
        year: 2022 + Math.floor(Math.random() * 4),
        createdAt: new Date(),
        joinedGroups: []
      };
      return setDoc(doc(usersRef, member.id), userDoc);
    });
    await Promise.all(userPromises);
    console.log(`Migrated ${MOCK_USERS.length} users`);
    return MOCK_USERS.map((m: Member) => m.id);
  } catch (error) {
    console.error('Error migrating users:', error);
    throw error;
  }
};

export const migrateMockStudyGroups = async () => {
  try {
    // First migrate users to get their IDs
    const userIds = await migrateMockUsers();
    const studyGroupsRef = collection(db, 'studyGroups');
    const groupPromises = STUDY_GROUPS.map(group => {
      // Store only user IDs in the group
      const { id, members, ...rest } = group;
      const firestoreGroup = {
        ...rest,
        createdAt: new Date(),
        startTime: new Date(),
        endTime: new Date(Date.now() + 7200000),
        status: 'active',
        users: members.map(m => m.id) // Store user IDs
      };
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