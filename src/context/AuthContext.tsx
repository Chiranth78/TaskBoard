
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider, isFirebaseInitialized, db } from '@/lib/firebase'; // Import firebase essentials and check function
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  isSynced: boolean; // Placeholder for sync status
  firebaseInitialized: boolean; // Indicate if Firebase is ready
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSynced, setIsSynced] = useState(false); // Placeholder
  const [firebaseInitialized, setFirebaseInitialized] = useState(false); // State for Firebase status
  const { toast } = useToast();

  useEffect(() => {
    const initialized = isFirebaseInitialized();
    setFirebaseInitialized(initialized);

    if (!initialized) {
      console.error("AuthContext: Firebase not initialized correctly. Authentication and Firestore operations will be disabled.");
      setLoading(false);
      // Show a persistent warning toast
      toast({
         title: "Configuration Error",
         description: "Firebase is not configured correctly (e.g., missing or invalid API key). Sign-in and data sync are disabled. Please check environment variables and Firebase Console settings.",
         variant: "destructive",
         duration: Infinity, // Keep the toast visible
       });
      return; // Stop further execution if Firebase isn't ready
    }

    // Proceed only if Firebase and auth are initialized correctly
    // Ensure auth is not null before subscribing
    if (!auth) {
         console.error("AuthContext: Firebase auth object is null despite initialization flag being true. This should not happen.");
         setLoading(false);
         setFirebaseInitialized(false); // Correct the state
         return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      // Placeholder: Update sync status based on login state
      setIsSynced(!!currentUser);
      if (currentUser) {
         console.log("User logged in:", currentUser.uid);
          // Trigger data fetching/syncing here if needed immediately after login
      } else {
         console.log("User logged out");
      }
    }, (error) => {
        // Handle potential errors during listener setup
        console.error("Error setting up auth state listener:", error);
        toast({ title: "Auth Error", description: `Could not listen for authentication changes: ${error.message}`, variant: "destructive" });
        setLoading(false);
        setFirebaseInitialized(false); // Mark as not usable
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [toast]); // Add toast to dependency array

  const signInWithGoogle = async () => {
    // Double-check initialization and necessary objects (auth, googleProvider)
    if (!firebaseInitialized || !auth || !googleProvider) {
        toast({ title: "Error", description: "Firebase not initialized correctly. Cannot sign in.", variant: "destructive" });
        return;
    }
    setLoading(true);
    try {
      // Make sure googleProvider is not null before using it
      await signInWithPopup(auth, googleProvider);
      // onAuthStateChanged will handle setting the user state
      toast({ title: "Login Successful", description: "Welcome back!" });
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      let description = "Could not sign in with Google.";
      // Handle specific Firebase auth errors
      switch (error.code) {
          case 'auth/api-key-not-valid':
            description = "Invalid Firebase API Key. Please check your configuration.";
            break;
          case 'auth/popup-closed-by-user':
            description = "Sign-in cancelled.";
            break;
          case 'auth/network-request-failed':
            description = "Network error during sign-in. Please check your connection.";
            break;
          case 'auth/cancelled-popup-request':
             description = "Sign-in cancelled (multiple popups).";
             break;
          case 'auth/operation-not-allowed':
             description = "Google Sign-In is not enabled in your Firebase project.";
             break;
          default:
            description = error.message || description;
            break;
      }
      toast({ title: "Login Failed", description: description, variant: "destructive" });
      setLoading(false); // Ensure loading is false on error
    }
    // setLoading(false); // Handled by onAuthStateChanged listener
  };

  const signOutUser = async () => {
     // Double-check initialization and auth object
     if (!firebaseInitialized || !auth) {
        toast({ title: "Error", description: "Firebase not initialized correctly. Cannot sign out.", variant: "destructive" });
        return;
    }
    setLoading(true);
    try {
      await signOut(auth);
      // onAuthStateChanged will handle setting the user state to null
      toast({ title: "Signed Out", description: "You have been signed out." });
    } catch (error: any) {
      console.error("Sign Out Error:", error);
      toast({ title: "Sign Out Failed", description: error.message || "Could not sign out.", variant: "destructive" });
    } finally {
        // Ensure loading is set to false after sign out attempt
        setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    signOutUser,
    isSynced, // Provide sync status
    firebaseInitialized, // Provide initialization status
  };

  // Render children regardless of initialization status,
  // as the UI components should handle the firebaseInitialized state.
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
    
