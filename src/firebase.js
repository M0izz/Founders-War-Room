// Firebase app initialisation
import { initializeApp } from 'firebase/app';
import {
  initializeAuth,
  browserLocalPersistence,
  browserPopupRedirectResolver,
  GoogleAuthProvider,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyCAZkhPBNumKkNgkWal79MeV7zvH29nI3M',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'founders-war-room.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'founders-war-room',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'founders-war-room.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1000347783866',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:1000347783866:web:7359075e7a9a1e0b0de883',
};

const app = initializeApp(firebaseConfig);

// initializeAuth requires an explicit popupRedirectResolver when using
// signInWithPopup — unlike getAuth() which bundles it automatically.
// browserLocalPersistence keeps the user logged in across page refreshes.
export const auth = initializeAuth(app, {
  persistence: browserLocalPersistence,
  popupRedirectResolver: browserPopupRedirectResolver,
});

export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
import { getFirestore } from 'firebase/firestore';

export const db = getFirestore(app);

export default app;
