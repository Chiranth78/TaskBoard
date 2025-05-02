
"use client";

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton


export default function AppHeader() {
  // Removed currentTime and greeting states
  const [currentDate, setCurrentDate] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // Component has mounted

    const updateDateTime = () => {
      const now = new Date();
      // Removed time setting
      setCurrentDate(format(now, 'EEEE, d MMM yyyy')); // Simpler date format

      // Removed greeting logic
    };

    updateDateTime(); // Initial update
    // No need for interval if only date is shown (updates daily)
    // If needed, keep interval: const intervalId = setInterval(updateDateTime, 60000);
    // return () => clearInterval(intervalId);

  }, []);


  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-background px-4 md:px-6">
      {/* Simplified structure: Date on the left, Avatar/More on the right */}
       <div className="flex flex-col">
           {isMounted && currentDate ? (
            <span className="text-sm font-medium text-foreground">{currentDate}</span> // Made date slightly bolder
            ) : (
                <Skeleton className="h-5 w-36" /> // Adjusted skeleton
            )}
           {/* Removed greeting */}
       </div>

         {/* Removed time display */}
       <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://picsum.photos/40/40" alt="User Avatar" data-ai-hint="user avatar initials" />
            <AvatarFallback>CU</AvatarFallback> {/* Default fallback */}
          </Avatar>
          <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-5 w-5" />
              <span className="sr-only">More options</span>
          </Button>
       </div>
    </header>
  );
}
