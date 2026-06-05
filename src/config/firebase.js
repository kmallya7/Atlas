import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyCtIx711n1-BDBpLIO0VslnazjQBM8_9Dk',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'atlas-51326.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'atlas-51326',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'atlas-51326.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '58115332098',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:58115332098:web:2963ad9c98a2ccdf7faf1b',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-V3KQ4RJRN8',
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export async function initAnalytics() {
  if (await isSupported()) {
    return getAnalytics(app);
  }
  return null;
}
