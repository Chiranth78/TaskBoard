
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Check for essential environment variables
if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
    throw new Error("Firebase API Key is missing. Please set NEXT_PUBLIC_FIREBASE_API_KEY environment variable.");
}
if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    console.warn("Firebase Project ID is missing. Some Firebase features might not work correctly. Please set NEXT_PUBLIC_FIREBASE_PROJECT_ID environment variable.");
}
if (!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) {
    console.warn("Firebase Auth Domain is missing. Authentication might not work correctly. Please set NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN environment variable.");
}


// Your web app's Firebase configuration
// IMPORTANT: Replace with your actual Firebase config values
// Consider using environment variables for security
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
let app: FirebaseApp;
try {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }
} catch (error) {
     console.error("Firebase initialization failed:", error);
     // Re-throw the error or handle it appropriately
     // Depending on the app's needs, you might want to show a user-friendly message
     // or prevent parts of the app from loading.
     throw new Error(`Firebase initialization failed. Please check your Firebase configuration and environment variables. Original error: ${error}`);
}


const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Add necessary scopes for potential future integrations if needed
// googleProvider.addScope('https://www.googleapis.com/auth/contacts.readonly');

export { app, auth, db, googleProvider };

