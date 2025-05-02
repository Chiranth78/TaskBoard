
"use client";

import React, { useState, useEffect } from 'react';
import {
    eachDayOfInterval,
    endOfMonth,
    endOfYear,
    format,
    getDay,
    isSameDay,
    isToday,
    parse,
    startOfDay,
    startOfMonth,
    startOfWeek,
    startOfYear,
    addMonths,
    subMonths,
    getYear,
    isWithinInterval,
    parseISO,
    isValid,
    addDays, // Added addDays
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { JournalEntry, JournalEntryDate } from '@/lib/types';

interface YearCalendarViewProps {
    journalEntries: JournalEntry[];
}

export default function YearCalendarView({ journalEntries }: YearCalendarViewProps) {
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [highlightedDates, setHighlightedDates] = useState<Set<string>>(new Set());
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        // Process journal entries to find dates with entries
        const datesWithEntries = new Set<string>();
        journalEntries.forEach(entry => {
            try {
                // Handle both Date and string types, ensuring validity
                const entryDateValue = typeof entry.date === 'string'
                    ? parseISO(entry.date)
                    : entry.date;

                if (isValid(entryDateValue)) {
                    const dateString = format(startOfDay(entryDateValue), 'yyyy-MM-dd');
                    datesWithEntries.add(dateString);
                } else {
                     console.warn("Invalid date found in journal entry:", entry.date);
                }
            } catch (error) {
                 console.error("Error processing journal entry date:", entry.date, error);
            }
        });
        setHighlightedDates(datesWithEntries);
    }, [journalEntries]);

    const firstDayOfYear = startOfYear(new Date(currentYear, 0, 1));

    const handlePreviousYear = () => {
        setCurrentYear(prev => prev - 1);
    };

    const handleNextYear = () => {
        setCurrentYear(prev => prev + 1);
    };

    const renderMonth = (monthIndex: number) => {
        const monthStart = startOfMonth(new Date(currentYear, monthIndex));
        const monthEnd = endOfMonth(monthStart);
        const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
        const startingDayOfWeek = getDay(monthStart) === 0 ? 6 : getDay(monthStart) - 1; // Monday is 0, Sunday is 6

        return (
            <div key={monthIndex} className="p-2">
                <h3 className="text-center font-semibold mb-2 text-sm text-foreground">
                    {format(monthStart, 'MMMM')}
                </h3>
                <div className="grid grid-cols-7 text-center text-xs text-muted-foreground mb-1">
                    <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
                </div>
                <div className="grid grid-cols-7 gap-px">
                    {/* Render empty cells for days before the start of the month */}
                    {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                        <div key={`empty-${i}`} className="aspect-square"></div>
                    ))}
                    {/* Render days of the month */}
                    {daysInMonth.map((day) => {
                        const dateString = format(day, 'yyyy-MM-dd');
                        const isHighlighted = highlightedDates.has(dateString);
                        return (
                            <div
                                key={day.toString()}
                                className={cn(
                                    "aspect-square flex items-center justify-center rounded text-xs", // Make font smaller
                                    isHighlighted ? "bg-primary/70 text-primary-foreground" : "bg-muted/30 text-muted-foreground", // Dim non-highlighted days
                                    isToday(day) && "ring-1 ring-ring ring-offset-1 ring-offset-background", // Highlight today
                                )}
                            >
                                {/* Show day number */}
                                {format(day, 'd')}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    if (!isMounted) {
        // Basic skeleton loader
        return (
             <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-50 cursor-not-allowed">
                         <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <CardTitle className="text-lg font-semibold animate-pulse bg-muted rounded w-24 h-6"></CardTitle>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-50 cursor-not-allowed">
                         <ChevronRight className="h-4 w-4" />
                    </Button>
                </CardHeader>
                <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-4">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="p-2 space-y-2">
                             <div className="h-4 w-16 mx-auto bg-muted rounded animate-pulse"></div>
                             <div className="h-3 w-full bg-muted rounded animate-pulse mb-1"></div>
                             <div className="grid grid-cols-7 gap-px">
                                {Array.from({ length: 35 }).map((_, j) => ( // Approximation
                                    <div key={j} className="aspect-square bg-muted/30 rounded animate-pulse"></div>
                                ))}
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between py-3 px-4 border-b">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={handlePreviousYear}>
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous Year</span>
                </Button>
                <CardTitle className="text-lg font-semibold text-foreground">{currentYear}</CardTitle>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={handleNextYear}>
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Next Year</span>
                </Button>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6 p-4">
                 {Array.from({ length: 12 }).map((_, i) => renderMonth(i))}
            </CardContent>
        </Card>
    );
}

// Helper function to generate days for a month (example, not used in final version)
function getDaysInMonth(date: Date) {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday start
    const endDate = startOfWeek(monthEnd, { weekStartsOn: 1 }); // Might need adjustment

    let days = [];
    let day = startDate;

    while (day <= monthEnd || getDay(day) !== 1) { // Continue until end of week containing month end
        days.push(day);
        day = addDays(day, 1);
        if (days.length > 42) break; // Safety break
    }
    return days;
}
