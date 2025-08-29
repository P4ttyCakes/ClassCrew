import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDZNmki1vSEDd-M5dEqibdjABl9mRvW__o",
  authDomain: "classcrew-9f26b.firebaseapp.com",
  projectId: "classcrew-9f26b",
  storageBucket: "classcrew-9f26b.appspot.com",
  messagingSenderId: "766811475718",
  appId: "1:766811475718:web:1d99bab4d8248457c95887",
  measurementId: "G-LSEQLF3D1N"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
// Use the bucket you provided
const storage = getStorage(app, 'gs://classcrew-9f26b.firebasestorage.app');

export { analytics, app, db, storage };
