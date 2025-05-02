
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Check for essential environment variables and provide specific warnings or errors
if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
    console.error("Firebase Error: NEXT_PUBLIC_FIREBASE_API_KEY is missing in your environment variables. Authentication and other Firebase services requiring an API key will fail.");
    // Optionally throw an error to halt execution if the API key is absolutely critical
    // throw new Error("Firebase API Key is missing. Please set NEXT_PUBLIC_FIREBASE_API_KEY environment variable.");
}
if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    console.warn("Firebase Warning: NEXT_PUBLIC_FIREBASE_PROJECT_ID is missing. Some Firebase features (like Firestore, Storage) might not work correctly. Please set NEXT_PUBLIC_FIREBASE_PROJECT_ID environment variable.");
}
if (!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) {
    console.warn("Firebase Warning: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN is missing. Authentication might not initialize or work correctly. Please set NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN environment variable.");
}


// Your web app's Firebase configuration using environment variables
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
// Check if all essential config values are present before initializing
if (firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId) {
    try {
        if (!getApps().length) {
          app = initializeApp(firebaseConfig);
        } else {
          app = getApp();
        }
    } catch (error) {
         console.error("Firebase initialization failed:", error);
         // Provide a more user-friendly message if initialization fails despite variables being present
         // This might indicate incorrect values or network issues
         alert(`Firebase initialization failed. Please check your Firebase configuration values and network connection. Original error: ${error}`);
         // Depending on the app's needs, you might throw an error or handle it gracefully
         // throw new Error(`Firebase initialization failed. Check config and network. Original error: ${error}`);
    }
} else {
    console.error("Firebase Error: Cannot initialize Firebase due to missing configuration (API Key, Auth Domain, or Project ID). Please check your .env.local file.");
    // Handle the case where essential config is missing - maybe show a message to the user
    // Prevent the app from trying to use Firebase services that will fail
    app = null as any; // Assign null or handle appropriately
}


// Initialize Auth and Firestore only if app initialization was successful
const auth = app ? getAuth(app) : null as any; // Assign null if app failed to initialize
const db = app ? getFirestore(app) : null as any; // Assign null if app failed to initialize
const googleProvider = new GoogleAuthProvider();

// Add necessary scopes for potential future integrations if needed
// googleProvider.addScope('https://www.googleapis.com/auth/contacts.readonly');

export { app, auth, db, googleProvider };

// Helper function to check if Firebase was initialized successfully
export const isFirebaseInitialized = (): boolean => !!app && !!auth && !!db;
