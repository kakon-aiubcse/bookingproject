import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDf5zCXR2EmkTIQ01RnpteTDey5AdE0ehE',
  authDomain: 'task1-5d742.firebaseapp.com',
  projectId: 'task1-5d742',
  storageBucket: 'task1-5d742.appspot.com',
  messagingSenderId: '853434735090',
  appId: '1:853434735090:web:b4f9223b93163b5dbc736b',
  measurementId: 'G-GH6VCT8T49'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// Initialize Analytics only in the client side
let analytics;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

// Initialize Authentication
const auth = getAuth(app);

export { app, analytics,  auth, db };
