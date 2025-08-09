import { addDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

// Function to add a test study group
export const createTestStudyGroup = async () => {
  try {
    const studyGroupsRef = collection(db, 'studyGroups');
    
    const testGroup = {
      title: "Test Study Session",
      subject: "computer science",
      mood: "focused",
      description: "Testing Firestore connection",
      location: "Library",
      coordinates: {
        latitude: 37.7849,
        longitude: -122.4194
      },
      createdAt: new Date(),
      startTime: new Date(),
      endTime: new Date(Date.now() + 3600000), // 1 hour from now
      memberCount: 1,
      members: [],
      status: 'active'
    };

    const docRef = await addDoc(studyGroupsRef, testGroup);
    console.log("Study group created with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error creating study group: ", error);
    throw error;
  }
};

// Function to fetch all study groups
export const getAllStudyGroups = async () => {
  try {
    const studyGroupsRef = collection(db, 'studyGroups');
    const snapshot = await getDocs(studyGroupsRef);
    
    const studyGroups = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log("Fetched study groups: ", studyGroups);
    return studyGroups;
  } catch (error) {
    console.error("Error fetching study groups: ", error);
    throw error;
  }
}; 
