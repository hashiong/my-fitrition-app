import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyADdqvwFzDSr3JnLyFf9RJ1PoSjBTd8IYk",
  authDomain: "fitrition-kitchen.firebaseapp.com",
  projectId: "fitrition-kitchen",
  storageBucket: "fitrition-kitchen.appspot.com",
  messagingSenderId: "246451406743",
  appId: "1:246451406743:web:f4ceaf17a3c46790dda6d2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };