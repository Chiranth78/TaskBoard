
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider, isFirebaseInitialized } from '@/lib/firebase'; // Import firebase essentials and check function
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  // Add sync status info later
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
      console.error("AuthContext: Firebase not initialized. Authentication will be disabled.");
      setLoading(false);
      // Optionally show a persistent warning to the user in the UI
      toast({
         title: "Configuration Error",
         description: "Firebase is not configured correctly. Sign-in is disabled. Please check environment variables.",
         variant: "destructive",
         duration: Infinity, // Keep the toast visible
       });
      return; // Stop further execution if Firebase isn't ready
    }

    // Only subscribe if Firebase and auth are initialized
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
        // Handle potential errors during listener setup (e.g., network issues)
        console.error("Error setting up auth state listener:", error);
        toast({ title: "Auth Error", description: "Could not listen for authentication changes.", variant: "destructive" });
        setLoading(false);
        setFirebaseInitialized(false); // Mark as not usable
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [toast]); // Add toast to dependency array

  const signInWithGoogle = async () => {
    if (!firebaseInitialized || !auth) {
        toast({ title: "Error", description: "Firebase not initialized. Cannot sign in.", variant: "destructive" });
        return;
    }
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      // onAuthStateChanged will handle setting the user state
      toast({ title: "Login Successful", description: "Welcome back!" });
      // setIsSynced(true); // Update sync status (handled by listener)
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      // Provide more specific error messages if possible
      let description = "Could not sign in with Google.";
      if (error.code === 'auth/popup-closed-by-user') {
        description = "Sign-in cancelled.";
      } else if (error.code === 'auth/network-request-failed') {
        description = "Network error during sign-in. Please check your connection.";
      } else if (error.message) {
          description = error.message;
      }
      toast({ title: "Login Failed", description: description, variant: "destructive" });
      setLoading(false); // Ensure loading is false on error
      // setIsSynced(false); // Handled by listener
    }
    // setLoading(false); // Handled by onAuthStateChanged
  };

  const signOutUser = async () => {
     if (!firebaseInitialized || !auth) {
        toast({ title: "Error", description: "Firebase not initialized. Cannot sign out.", variant: "destructive" });
        return;
    }
    setLoading(true);
    try {
      await signOut(auth);
      // onAuthStateChanged will handle setting the user state to null
      toast({ title: "Signed Out", description: "You have been signed out." });
       // setIsSynced(false); // Update sync status (handled by listener)
    } catch (error: any) {
      console.error("Sign Out Error:", error);
      toast({ title: "Sign Out Failed", description: error.message || "Could not sign out.", variant: "destructive" });
    } finally {
        // Ensure loading is set to false after sign out attempt,
        // even if onAuthStateChanged hasn't fired yet.
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

  // Render children only once initialization status is determined
  // or provide a loading state if preferred
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
