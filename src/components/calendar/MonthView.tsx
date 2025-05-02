
"use client";

import React from 'react';
import {
    eachDayOfInterval,
    endOfMonth,
    format,
    getDay,
    isSameDay,
    isToday,
    startOfMonth,
} from 'date-fns';
import { cn } from '@/lib/utils';

interface MonthViewProps {
    monthDate: Date; // The first day of the month to display
    highlightedDates: Set<string>; // Set of YYYY-MM-DD strings
    onDateClick?: (date: Date) => void; // Optional click handler
}

const MonthView: React.FC<MonthViewProps> = ({ monthDate, highlightedDates, onDateClick }) => {
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthStart);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    // Calculate starting day index (0 for Monday, 6 for Sunday)
    const startingDayIndex = (getDay(monthStart) + 6) % 7;

    const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

    return (
        <div className="p-2">
            <h3 className="text-center font-semibold mb-2 text-sm text-foreground">
                {format(monthStart, 'MMMM')}
            </h3>
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 text-center text-xs text-muted-foreground mb-1">
                {weekDays.map((day) => (
                    <span key={day}>{day}</span>
                ))}
            </div>
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-px">
                {/* Empty cells before the start of the month */}
                {Array.from({ length: startingDayIndex }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square"></div>
                ))}
                {/* Days of the month */}
                {daysInMonth.map((day) => {
                    const dateString = format(day, 'yyyy-MM-dd');
                    const isHighlighted = highlightedDates.has(dateString);

                    return (
                        <button
                            key={day.toString()}
                            onClick={() => onDateClick?.(day)}
                            className={cn(
                                "aspect-square flex items-center justify-center rounded text-xs transition-colors duration-150",
                                isHighlighted ? "bg-primary/70 text-primary-foreground hover:bg-primary/90" : "bg-muted/30 hover:bg-muted/60",
                                isToday(day) && "ring-1 ring-ring ring-offset-1 ring-offset-background", // Highlight today
                                !isHighlighted && "text-muted-foreground", // Slightly dim non-highlighted days
                                onDateClick ? "cursor-pointer" : "cursor-default" // Change cursor based on click handler
                            )}
                            // disabled={!onDateClick} // Disable if no click handler
                        >
                           {/* Keep the day number small */}
                           {/* {format(day, 'd')} */}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default MonthView;
