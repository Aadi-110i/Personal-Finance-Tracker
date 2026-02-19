import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDnn8DOhtA33QPmDLXp47ykjivNe6s7NUY",
  authDomain: "finance-tracker-ec951.firebaseapp.com",
  projectId: "finance-tracker-ec951",
  storageBucket: "finance-tracker-ec951.firebasestorage.app",
  messagingSenderId: "670121506218",
  appId: "1:670121506218:web:ff9c67f7dd3f8fd3ce67d3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
