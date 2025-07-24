// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDZNmki1vSEDd-M5dEqibdjABl9mRvW__o",
  authDomain: "classcrew-9f26b.firebaseapp.com",
  projectId: "classcrew-9f26b",
  storageBucket: "classcrew-9f26b.firebasestorage.app",
  messagingSenderId: "766811475718",
  appId: "1:766811475718:web:1d99bab4d8248457c95887",
  measurementId: "G-LSEQLF3D1N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { analytics, app };

