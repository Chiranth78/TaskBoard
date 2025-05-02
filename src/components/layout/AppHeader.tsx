"use client";

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton


export default function AppHeader() {
  const [currentTime, setCurrentTime] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<string | null>(null);
  const [greeting, setGreeting] = useState<string>('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // Component has mounted

    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(format(now, 'HH:mm')); // Format time as HH:mm
      setCurrentDate(format(now, 'EEEE, d MMM, yyyy')); // Format date like Friday, 2 May, 2025

      // Determine greeting based on time
      const hour = now.getHours();
      if (hour < 12) {
        setGreeting('Good morning.');
      } else if (hour < 18) {
        setGreeting('Good afternoon.');
      } else {
        setGreeting('Good evening.');
      }
    };

    updateDateTime(); // Initial update
    const intervalId = setInterval(updateDateTime, 60000); // Update every minute

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);


  return (
    <header className="sticky top-0 z-10 flex h-auto flex-col gap-2 bg-background px-4 py-3 md:px-6">
       <div className="flex items-center justify-between">
         {isMounted && currentTime ? (
           <span className="text-sm text-muted-foreground">{currentTime}</span>
         ) : (
            <Skeleton className="h-4 w-10" />
         )}
         <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              {/* Add placeholder image source if needed */}
              <AvatarImage src="https://picsum.photos/40/40" alt="User Avatar" data-ai-hint="user avatar initials" />
              <AvatarFallback>CU</AvatarFallback> {/* Default fallback */}
            </Avatar>
            <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-5 w-5" />
                <span className="sr-only">More options</span>
            </Button>
         </div>
       </div>
       <div className="flex flex-col">
           {isMounted && currentDate ? (
            <span className="text-xs text-muted-foreground">{currentDate}</span>
            ) : (
                <Skeleton className="h-3 w-32 mb-1" />
            )}
           {isMounted && greeting ? (
                <h1 className="text-3xl font-bold text-foreground">{greeting}</h1>
            ) : (
                <Skeleton className="h-8 w-48" />
           )}
       </div>

    </header>
  );
}
