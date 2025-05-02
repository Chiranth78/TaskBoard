
"use client";

import type { JournalEntry } from '@/lib/types'; // Import JournalEntry type
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
// Import necessary icons: LogOut, User, Mail, Link as LinkIcon, Download, Sync
import { MoreVertical, LogOut, User, Mail, Link as LinkIcon, Download, Loader2, CheckCircle, XCircle, AlertTriangle } from "lucide-react"; // Added AlertTriangle
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Import DropdownMenu components
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/context/AuthContext'; // Import useAuth hook

// Helper function to download JSON data (remains the same)
const downloadJson = (data: any, filename: string) => {
    const jsonString = JSON.stringify(data, null, 2); // Pretty print JSON
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};


interface AppHeaderProps {
  journalEntries: JournalEntry[]; // Add journalEntries prop
}


export default function AppHeader({ journalEntries }: AppHeaderProps) {
  const [currentDate, setCurrentDate] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast(); // Initialize toast
  const { user, loading, signInWithGoogle, signOutUser, isSynced, firebaseInitialized } = useAuth(); // Use auth context, including firebaseInitialized

  useEffect(() => {
    setIsMounted(true); // Component has mounted

    const updateDateTime = () => {
      const now = new Date();
      setCurrentDate(format(now, 'EEEE, d MMM yyyy'));
    };

    updateDateTime(); // Initial update

  }, []);

  const handleExportData = () => {
     if (!journalEntries || journalEntries.length === 0) {
       toast({
         title: "No Data",
         description: "There are no journal entries to export.",
         variant: "destructive",
       });
       return;
     }

     try {
        const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
        const filename = `taskgrid_journal_export_${timestamp}.json`;
        downloadJson(journalEntries, filename);

        toast({
         title: "Export Successful",
         description: `Journal entries exported to ${filename}`,
       });
     } catch (error) {
        console.error("Export failed:", error);
        toast({
         title: "Export Failed",
         description: "Could not export journal entries. See console for details.",
         variant: "destructive",
       });
     }
   };


  const handleSignOut = async () => {
      await signOutUser();
  };

  const handleSignIn = async () => {
      await signInWithGoogle();
   };

   // Function to get sync status indicator
   const getSyncStatusIndicator = () => {
      if (!firebaseInitialized) {
           return <span className="text-xs text-muted-foreground flex items-center"><AlertTriangle className="mr-1 h-3 w-3 text-destructive" /> Config Error</span>;
      }
      if (loading && !user) {
          // Initial loading state or loading during sign-in/out
          return <span className="text-xs text-muted-foreground flex items-center"><Loader2 className="mr-1 h-3 w-3 animate-spin" /> Checking...</span>;
      }
      if (!user) {
           return <span className="text-xs text-muted-foreground flex items-center"><XCircle className="mr-1 h-3 w-3 text-muted-foreground" /> Not Signed In</span>; // Changed icon color
      }
      // Placeholder for actual sync logic - for now, just check if user is logged in
      if (isSynced) { // Replace with actual sync state later
          return <span className="text-xs text-muted-foreground flex items-center"><CheckCircle className="mr-1 h-3 w-3 text-green-500" /> Synced</span>;
      } else {
          // This state might represent syncing in progress or an error
           return <span className="text-xs text-muted-foreground flex items-center"><Loader2 className="mr-1 h-3 w-3 animate-spin" /> Syncing...</span>;
           // Or show error: <span className="text-xs text-muted-foreground flex items-center"><XCircle className="mr-1 h-3 w-3 text-destructive" /> Sync Error</span>;
      }
   };


  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-background px-4 md:px-6">
       <div className="flex flex-col">
           {isMounted && currentDate ? (
            <span className="text-sm font-medium text-foreground">{currentDate}</span>
            ) : (
                <Skeleton className="h-5 w-36" />
            )}
           {/* Sync Status Display */}
           {isMounted ? getSyncStatusIndicator() : <Skeleton className="h-4 w-20 mt-1" />}
       </div>

       <div className="flex items-center gap-3">
           <DropdownMenu>
              {/* Disable trigger if Firebase isn't ready */}
              <DropdownMenuTrigger asChild disabled={!firebaseInitialized}>
                 <button className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed">
                     <Avatar className="h-8 w-8 cursor-pointer">
                          {/* Add data-ai-hint */}
                         <AvatarImage src={user?.photoURL || undefined} alt={user?.displayName?.[0] || 'U'} data-ai-hint="user avatar initials placeholder" />
                         {/* Fallback uses initials or 'U' */}
                         <AvatarFallback>{user?.displayName ? user.displayName[0].toUpperCase() : 'U'}</AvatarFallback>
                     </Avatar>
                     <MoreVertical className="h-5 w-5 text-muted-foreground" />
                     <span className="sr-only">Account options</span>
                 </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                  {/* Show specific message if Firebase isn't initialized */}
                  {!firebaseInitialized ? (
                     <DropdownMenuLabel className="font-normal text-destructive text-xs px-2 py-2 flex items-center">
                        <AlertTriangle className="mr-2 h-4 w-4" /> Firebase not configured.
                     </DropdownMenuLabel>
                  ) : user ? (
                      <>
                         <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                               <p className="text-sm font-medium leading-none flex items-center">
                                  <User className="mr-2 h-4 w-4 text-muted-foreground" />
                                  {user.displayName || "User"}
                               </p>
                               <p className="text-xs leading-none text-muted-foreground flex items-center">
                                  <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                                   {user.email || "No email"}
                               </p>
                            </div>
                         </DropdownMenuLabel>
                         <DropdownMenuSeparator />
                         <DropdownMenuItem onClick={handleExportData}>
                             <Download className="mr-2 h-4 w-4" />
                             <span>Export Journal Data</span>
                         </DropdownMenuItem>
                         {/* Sync Status (Optional: could add a manual sync trigger here too) */}
                         {/* Render indicator directly in the menu item */}
                         <DropdownMenuItem disabled className="opacity-100 cursor-default focus:bg-transparent">
                              {getSyncStatusIndicator()}
                          </DropdownMenuItem>
                         <DropdownMenuSeparator />
                         <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                            <LogOut className="mr-2 h-4 w-4" />
                             <span>Sign Out</span>
                         </DropdownMenuItem>
                      </>
                  ) : (
                      <>
                         <DropdownMenuItem onClick={handleSignIn} disabled={loading || !firebaseInitialized}>
                             <LinkIcon className="mr-2 h-4 w-4" />
                             <span>{loading ? 'Signing In...' : 'Sign In with Google'}</span>
                              {loading && <Loader2 className="ml-auto h-4 w-4 animate-spin" />}
                         </DropdownMenuItem>
                      </>
                  )}

              </DropdownMenuContent>
           </DropdownMenu>
       </div>
    </header>
  );
}

