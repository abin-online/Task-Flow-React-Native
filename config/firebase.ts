import { FIREBASE_CONFIG } from '@/constants/firebase';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';

const firebaseApp = initializeApp(FIREBASE_CONFIG);


let analytics: ReturnType<typeof getAnalytics> | undefined;

if (typeof window !== 'undefined') {
  // Run only in browser environment
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(firebaseApp);
      console.log('Firebase Analytics initialized');
    } else {
      console.log('Firebase Analytics not supported in this environment');
    }
  });
}

export { analytics, firebaseApp };

