
"use client";

import type { JournalEntry } from '@/lib/types'; // Import JournalEntry type
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreVertical, LogOut, User, Mail, Link as LinkIcon, Download } from "lucide-react"; // Import necessary icons
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

// Helper function to download JSON data
const downloadJson = (data: unknown, filename: string) => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(data, null, 2) // Pretty print JSON
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = filename;
    link.click();
    document.removeChild(link); // Clean up link element - This line causes error, should be document.body.removeChild(link)
};


interface AppHeaderProps {
  journalEntries: JournalEntry[]; // Add journalEntries prop
}


export default function AppHeader({ journalEntries }: AppHeaderProps) {
  const [currentDate, setCurrentDate] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast(); // Initialize toast

  // Mock user data (replace with actual auth data later)
  const mockUser = {
    name: "Current User",
    email: "user@example.com",
    avatarUrl: "https://picsum.photos/40/40",
    isGoogleLinked: false, // Example state
  };

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
        // Create a downloadable blob
        const jsonString = JSON.stringify(journalEntries, null, 2); // Pretty print
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
        link.download = `taskgrid_journal_export_${timestamp}.json`;
        document.body.appendChild(link); // Append to body
        link.click();
        document.body.removeChild(link); // Remove after click
        URL.revokeObjectURL(url); // Clean up blob URL

        toast({
         title: "Export Successful",
         description: `Journal entries exported to taskgrid_journal_export_${timestamp}.json`,
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


  const handleSignOut = () => {
    // Placeholder for sign out logic
    toast({ title: "Sign Out", description: "Sign out functionality coming soon." });
  };

  const handleLinkGoogle = () => {
     // Placeholder for linking Google account logic
     toast({ title: "Link Account", description: "Google account linking coming soon." });
   };


  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-background px-4 md:px-6">
       <div className="flex flex-col">
           {isMounted && currentDate ? (
            <span className="text-sm font-medium text-foreground">{currentDate}</span>
            ) : (
                <Skeleton className="h-5 w-36" />
            )}
       </div>

       <div className="flex items-center gap-3">
           <DropdownMenu>
              <DropdownMenuTrigger asChild>
                 {/* Combine Avatar and MoreVertical into one trigger area if desired, or keep separate */}
                  {/* Using Avatar as the primary trigger */}
                 <button className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-full">
                     <Avatar className="h-8 w-8 cursor-pointer">
                         <AvatarImage src={mockUser.avatarUrl} alt="User Avatar" data-ai-hint="user avatar initials" />
                         <AvatarFallback>CU</AvatarFallback>
                     </Avatar>
                     <MoreVertical className="h-5 w-5 text-muted-foreground" />
                     <span className="sr-only">Account options</span>
                 </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                 <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                       <p className="text-sm font-medium leading-none flex items-center">
                          <User className="mr-2 h-4 w-4 text-muted-foreground" />
                          {mockUser.name}
                       </p>
                       <p className="text-xs leading-none text-muted-foreground flex items-center">
                          <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                           {mockUser.email}
                       </p>
                    </div>
                 </DropdownMenuLabel>
                 <DropdownMenuSeparator />
                 <DropdownMenuItem onClick={handleLinkGoogle} disabled={mockUser.isGoogleLinked}>
                    <LinkIcon className="mr-2 h-4 w-4" />
                     <span>{mockUser.isGoogleLinked ? "Google Linked" : "Link with Google"}</span>
                 </DropdownMenuItem>
                 <DropdownMenuItem onClick={handleExportData}>
                     <Download className="mr-2 h-4 w-4" />
                     <span>Export Journal Data</span>
                 </DropdownMenuItem>
                 <DropdownMenuSeparator />
                 <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                    <LogOut className="mr-2 h-4 w-4" />
                     <span>Sign Out</span>
                 </DropdownMenuItem>
              </DropdownMenuContent>
           </DropdownMenu>
       </div>
    </header>
  );
}
