import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDpdCKBI8b9D8qNcIuKZwxY5TwOBRzLMwQ",
  authDomain: "x-book-a8881.firebaseapp.com",
  databaseURL: "https://x-book-a8881-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "x-book-a8881",
  storageBucket: "x-book-a8881.firebasestorage.app",
  messagingSenderId: "767208258152",
  appId: "1:767208258152:web:aac96ccd3fafed991b99dd",
  measurementId: "G-QXDLK4559G"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
