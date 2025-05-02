"use client";

import type { JournalEntryDate } from '@/lib/types';
import { Calendar } from "@/components/ui/calendar";
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ConsistencyTrackerProps {
  entryDates: JournalEntryDate[]; // Expecting dates in 'YYYY-MM-DD' format
}

export default function ConsistencyTracker({ entryDates }: ConsistencyTrackerProps) {
  const [highlightedDates, setHighlightedDates] = useState<Date[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Convert string dates to Date objects for the Calendar component
    const dates = entryDates
      .map(dateStr => {
        const [year, month, day] = dateStr.split('-').map(Number);
        // Create date in UTC to avoid timezone issues with matching
        return new Date(Date.UTC(year, month - 1, day));
      })
      .filter(date => !isNaN(date.getTime())); // Filter out invalid dates
    setHighlightedDates(dates);
  }, [entryDates]);

  if (!isMounted) {
    // Basic skeleton loader for the calendar size
    return <div className="w-full h-[310px] bg-muted rounded-md animate-pulse"></div>;
  }


  return (
    <div className="w-full">
       <h3 className="text-sm font-medium text-sidebar-foreground/80 mb-2 px-2">Journal Consistency</h3>
        <Calendar
            mode="multiple" // Allows displaying multiple selected dates visually
            selected={highlightedDates} // Dates with entries are "selected" visually
            disabled // Make the calendar non-interactive for selection
            className="p-0 [&_button]:pointer-events-none" // Disable button interactions visually
            styles={{
              day: {
                  height: "2rem", // Slightly smaller days
                  width: "2rem",
                  fontSize: "0.75rem"
              },
              head_cell: {
                  width: "2rem",
                  fontSize: "0.75rem"
              },
               caption_label: {
                  fontSize: "0.875rem"
               },
               nav_button: {
                  height: "1.75rem",
                  width: "1.75rem"
               }
            }}
             modifiers={{
               highlighted: highlightedDates, // Use the dates with entries for custom styling
            }}
             modifiersStyles={{
               highlighted: {
                 backgroundColor: 'hsl(var(--secondary))', // Muted Green background
                 color: 'hsl(var(--secondary-foreground))', // Contrasting text color
                 borderRadius: '50%', // Make it a circle
               },
             }}
             ISOWeek // Optional: Show week numbers
        />
    </div>

  );
}
