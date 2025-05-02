
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  // Add sync status info later
  isSynced: boolean; // Placeholder for sync status
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSynced, setIsSynced] = useState(false); // Placeholder
  const { toast } = useToast();

  useEffect(() => {
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
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      // onAuthStateChanged will handle setting the user state
      toast({ title: "Login Successful", description: "Welcome back!" });
      // setIsSynced(true); // Update sync status
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      toast({ title: "Login Failed", description: error.message || "Could not sign in with Google.", variant: "destructive" });
      setLoading(false); // Ensure loading is false on error
      // setIsSynced(false);
    }
    // setLoading(false); // Handled by onAuthStateChanged
  };

  const signOutUser = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      // onAuthStateChanged will handle setting the user state to null
      toast({ title: "Signed Out", description: "You have been signed out." });
       // setIsSynced(false); // Update sync status
    } catch (error: any) {
      console.error("Sign Out Error:", error);
      toast({ title: "Sign Out Failed", description: error.message || "Could not sign out.", variant: "destructive" });
    } finally {
        setLoading(false); // Ensure loading is set to false after sign out attempt
    }
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    signOutUser,
    isSynced, // Provide sync status
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
