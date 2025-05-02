
"use client";

import { useState, useEffect } from 'react';
import { format, addDays, subDays, startOfWeek, getWeek, getDate, getDay } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton

export default function WeekCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [weekDates, setWeekDates] = useState<Date[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const start = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday start
        const dates = Array.from({ length: 7 }).map((_, i) => addDays(start, i));
        setWeekDates(dates);
    }, [currentDate]);

    const handlePreviousWeek = () => {
        setCurrentDate(subDays(currentDate, 7));
    };

    const handleNextWeek = () => {
        setCurrentDate(addDays(currentDate, 7));
    };

    const getDayInitial = (date: Date): string => {
        return format(date, 'EEEEE'); // Single letter day (e.g., M, T, W)
    };

    if (!isMounted) {
        // Skeleton loader for the week calendar
        return (
            <div className="flex items-center justify-between mt-6 border-t border-border pt-4">
                <Skeleton className="h-8 w-20" /> {/* Week number */}
                <div className="flex space-x-1">
                    {Array.from({ length: 7 }).map((_, i) => (
                         <div key={`skel-day-${i}`} className="flex flex-col items-center w-9">
                            <Skeleton className="h-4 w-4 mb-1" />
                            <Skeleton className="h-6 w-6 rounded-full" />
                        </div>
                    ))}
                </div>
                <div className="flex gap-1">
                    <Skeleton className="h-7 w-7" />
                    <Skeleton className="h-7 w-7" />
                </div>
            </div>
        );
    }


    return (
        <div className="flex items-center justify-between mt-6 border-t border-border pt-4">
            {/* Week Number and Navigation */}
            <div className="flex items-center text-sm font-medium text-muted-foreground">
                <span>W{getWeek(currentDate, { weekStartsOn: 1 })}</span>
                 {/* Add hidden buttons for spacing or adjust flex layout */}
                 <Button variant="ghost" size="icon" className="h-7 w-7 ml-1 opacity-0 pointer-events-none" aria-hidden="true">
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                 <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 pointer-events-none" aria-hidden="true">
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>

            {/* Days of the Week */}
            <div className="flex space-x-1">
                {weekDates.map((date, index) => {
                    const dayNumber = getDate(date);
                    const dayInitial = getDayInitial(date);
                    const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                    const isFuture = date > new Date(); // Basic check if date is in the future

                    return (
                        <div key={index} className="flex flex-col items-center w-9 cursor-pointer group">
                            <span className="text-xs font-medium text-muted-foreground mb-1 group-hover:text-foreground">
                                {dayInitial}
                            </span>
                            <span
                                className={cn(
                                    "flex items-center justify-center h-7 w-7 rounded-full text-sm font-medium transition-colors",
                                    isToday
                                        ? "bg-primary text-primary-foreground"
                                        : "text-foreground hover:bg-accent hover:text-accent-foreground",
                                    isFuture && !isToday && "text-muted-foreground/60" // Dim future dates slightly
                                )}
                            >
                                {dayNumber}
                            </span>
                        </div>
                    );
                })}
            </div>

             {/* Navigation Arrows */}
            <div className="flex gap-1">
                 <Button variant="ghost" size="icon" onClick={handlePreviousWeek} className="h-7 w-7 text-muted-foreground hover:text-foreground">
                    <ChevronLeft className="h-4 w-4" />
                     <span className="sr-only">Previous Week</span>
                 </Button>
                 <Button variant="ghost" size="icon" onClick={handleNextWeek} className="h-7 w-7 text-muted-foreground hover:text-foreground">
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Next Week</span>
                 </Button>
            </div>
        </div>
    );
}

    