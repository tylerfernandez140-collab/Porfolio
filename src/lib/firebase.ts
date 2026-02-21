import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA3bbmYW30mFjbVybyP1wSXv7Vi8MRt_eQ",
  authDomain: "portfolio-chat-4bde8.firebaseapp.com",
  projectId: "portfolio-chat-4bde8",
  storageBucket: "portfolio-chat-4bde8.firebasestorage.app",
  messagingSenderId: "486781474839",
  appId: "1:486781474839:web:82cce178e523d2e1aa2452"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export { db, analytics };
export default app;
