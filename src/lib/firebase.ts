
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Check for essential environment variables and provide specific warnings or errors
const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

if (!apiKey) {
    // Log a more prominent error in the server console during build/startup
    console.error("\n\n\nFATAL ERROR: Firebase API Key (NEXT_PUBLIC_FIREBASE_API_KEY) is missing!");
    console.error("Please ensure this environment variable is set correctly in your .env.local file.");
    console.error("Firebase features will not work without a valid API key.\n\n\n");
    // We don't throw here anymore, but the console error should be noticeable.
    // The app will proceed, but isFirebaseInitialized will be false.
}
if (!projectId) {
    console.warn("Firebase Warning: NEXT_PUBLIC_FIREBASE_PROJECT_ID is missing. Some Firebase features (like Firestore, Storage) might not work correctly. Please set this environment variable.");
}
if (!authDomain) {
    console.warn("Firebase Warning: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN is missing. Authentication might not initialize or work correctly. Please set this environment variable.");
}


// Your web app's Firebase configuration using environment variables
const firebaseConfig = { 
  apiKey: "AIzaSyA-28qx7ESIwCka76Pu0O3wDkf1nRSgpFI",
  authDomain: "taskgrid-gx2rk.firebaseapp.com",
  projectId: "taskgrid-gx2rk",
  storageBucket: "taskgrid-gx2rk.firebasestorage.app",
  messagingSenderId: "1020397139722",
  appId: "1:1020397139722:web:bf65cf8c82d1dbc5ae2cf3"
};

// Initialize Firebase
let app: FirebaseApp | null = null; // Initialize as null
let auth: ReturnType<typeof getAuth> | null = null;
let db: ReturnType<typeof getFirestore> | null = null;
let googleProvider: GoogleAuthProvider | null = null;

// Check if all essential config values are present before initializing
if (firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId) {
    try {
        if (!getApps().length) {
          app = initializeApp(firebaseConfig);
          console.log("Firebase initialized successfully.");
        } else {
          app = getApp();
          console.log("Firebase app already initialized.");
        }
        // Initialize services only if app is valid
        auth = getAuth(app);
        db = getFirestore(app);
        googleProvider = new GoogleAuthProvider();
        // Add necessary scopes for potential future integrations if needed
        // googleProvider.addScope('https://www.googleapis.com/auth/contacts.readonly');

    } catch (error) {
         console.error("Firebase initialization failed:", error);
         // Provide a more user-friendly message if initialization fails despite variables being present
         // This might indicate incorrect values or network issues
         // The AuthContext will handle showing a message to the user
         app = null; // Ensure app is null on error
         auth = null;
         db = null;
         googleProvider = null;
    }
} else {
    console.error("Firebase Error: Cannot initialize Firebase due to missing essential configuration (API Key, Auth Domain, or Project ID).");
    // Ensure services are null if config is missing
    app = null;
    auth = null;
    db = null;
    googleProvider = null;
}

// Helper function to check if Firebase was initialized successfully
// It now checks if app, auth, db, and provider objects were successfully created.
export const isFirebaseInitialized = (): boolean => !!app && !!auth && !!db && !!googleProvider;

// Export potentially null values. The consuming code (AuthContext) MUST check isFirebaseInitialized before using them.
export { app, auth, db, googleProvider };
