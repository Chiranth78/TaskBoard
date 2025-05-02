
"use client";

import { useState, useEffect } from 'react';
import { format, startOfWeek, addDays, isSameDay, getWeek } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface WeekCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export default function WeekCalendar({ selectedDate, onDateSelect }: WeekCalendarProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(selectedDate, { weekStartsOn: 1 })); // Monday start
  const [weekNumber, setWeekNumber] = useState(getWeek(currentWeekStart, { weekStartsOn: 1 }));
  const [days, setDays] = useState<Date[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
     setIsMounted(true);
     // Update week start and number if selectedDate prop changes
     const newWeekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
     setCurrentWeekStart(newWeekStart);
     setWeekNumber(getWeek(newWeekStart, { weekStartsOn: 1 }));
   }, [selectedDate]);

  useEffect(() => {
     // Generate days for the current week
     const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(currentWeekStart, i));
     setDays(weekDays);
  }, [currentWeekStart]);

   const handlePreviousWeek = () => {
     const prevWeekStart = addDays(currentWeekStart, -7);
     setCurrentWeekStart(prevWeekStart);
     setWeekNumber(getWeek(prevWeekStart, { weekStartsOn: 1 }));
     // Optionally select the first day of the previous week
     // onDateSelect(prevWeekStart);
   };

   const handleNextWeek = () => {
      const nextWeekStart = addDays(currentWeekStart, 7);
      setCurrentWeekStart(nextWeekStart);
      setWeekNumber(getWeek(nextWeekStart, { weekStartsOn: 1 }));
       // Optionally select the first day of the next week
       // onDateSelect(nextWeekStart);
   };

  if (!isMounted) {
    // Optional: Render a skeleton or placeholder
    return <div className="h-20 animate-pulse rounded-md bg-muted"></div>;
  }

  return (
    <div className="mt-6">
       <div className="flex items-center justify-between mb-2">
         <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
           <span>W{weekNumber}</span>
         </div>
         <div className="flex gap-1">
             <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" onClick={handlePreviousWeek}>
               <ChevronLeft className="h-4 w-4" />
               <span className="sr-only">Previous Week</span>
             </Button>
             <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" onClick={handleNextWeek}>
               <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next Week</span>
             </Button>
         </div>
       </div>
       <div className="grid grid-cols-7 gap-1 text-center text-sm">
         {days.map(day => (
           <button
             key={day.toString()}
             onClick={() => onDateSelect(day)}
             className={cn(
               "flex flex-col items-center justify-center p-2 rounded-md transition-colors",
               isSameDay(day, selectedDate)
                 ? "bg-primary text-primary-foreground font-semibold"
                 : "hover:bg-muted text-muted-foreground",
               format(day, 'EEEEEE') === 'Sa' || format(day, 'EEEEEE') === 'Su' ? 'opacity-70' : '' // Dim weekends slightly
             )}
           >
             <span className="text-xs uppercase mb-1">{format(day, 'EEEEE')}</span> {/* Single letter day */}
             <span>{format(day, 'd')}</span>
           </button>
         ))}
       </div>
     </div>
  );
}
