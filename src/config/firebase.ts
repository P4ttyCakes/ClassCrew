import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDZNmki1vSEDd-M5dEqibdjABl9mRvW__o",
  authDomain: "classcrew-9f26b.firebaseapp.com",
  projectId: "classcrew-9f26b",
  storageBucket: "classcrew-9f26b.firebasestorage.app",
  messagingSenderId: "766811475718",
  appId: "1:766811475718:web:1d99bab4d8248457c95887",
  measurementId: "G-LSEQLF3D1N"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { analytics, app, db };
