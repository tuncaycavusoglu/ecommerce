import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  type User,
} from 'firebase/auth';

// Firebase yapılandırması
const firebaseConfig = {
  apiKey: "AIzaSyBRRePvOS4A76ILEjqtyiYS_MktDzwxnZI",
  authDomain: "ecommerce-47503.firebaseapp.com",
  projectId: "ecommerce-47503",
  storageBucket: "ecommerce-47503.firebasestorage.app",
  messagingSenderId: "795148005829",
  appId: "1:795148005829:web:d4db2343f7e437ccca9bac"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
};
export type { User };
