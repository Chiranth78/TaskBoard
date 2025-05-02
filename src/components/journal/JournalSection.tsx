
"use client";

import type { JournalEntry, Task } from '@/lib/types';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { format, parseISO, startOfDay, isValid } from 'date-fns';
import { Save, ArrowLeft, ArrowRight } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface JournalSectionProps {
  initialEntries: JournalEntry[];
  tasks: Task[];
  onEntriesChange: (entries: JournalEntry[]) => void;
}

export default function JournalSection({ initialEntries, tasks, onEntriesChange }: JournalSectionProps) {
  const [entries, setEntries] = useState<JournalEntry[]>(initialEntries);
  const [currentEntryContent, setCurrentEntryContent] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date()));
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
    loadEntryForDate(selectedDate);
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);


   useEffect(() => {
     setEntries(initialEntries);
     loadEntryForDate(selectedDate);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [initialEntries]);


  const loadEntryForDate = (date: Date) => {
      const dateString = format(date, 'yyyy-MM-dd');
      const foundEntry = entries.find(entry => {
         try {
            const entryDateValue = typeof entry.date === 'string' ? startOfDay(parseISO(entry.date)) : startOfDay(entry.date);
            return isValid(entryDateValue) && format(entryDateValue, 'yyyy-MM-dd') === dateString;
         } catch (error) {
             console.error("Error parsing date:", entry.date, error);
             return false;
         }
      });
      setCurrentEntryContent(foundEntry ? foundEntry.content : '');
  }

  const handleSaveEntry = () => {
     const dateString = format(selectedDate, 'yyyy-MM-dd');
    const existingEntryIndex = entries.findIndex(entry => {
        try {
            const entryDateValue = typeof entry.date === 'string' ? startOfDay(parseISO(entry.date)) : startOfDay(entry.date);
            return isValid(entryDateValue) && format(entryDateValue, 'yyyy-MM-dd') === dateString;
        } catch (error) {
            console.error("Error parsing date:", entry.date, error);
            return false;
        }
    });

    const completedTasksToday = tasks.filter(task => {
        if (!task.completed || !task.updatedAt) return false;
        try {
            const completedDate = typeof task.updatedAt === 'string' ? parseISO(task.updatedAt) : task.updatedAt;
             return isValid(completedDate) && format(startOfDay(completedDate), 'yyyy-MM-dd') === dateString;
        } catch (error) {
            console.error("Error parsing task completion date:", task.updatedAt, error);
            return false;
        }
    }).map(task => task.id);


    let savedEntry: JournalEntry | null = null;
    let updatedEntries: JournalEntry[] = [...entries];

    if (existingEntryIndex > -1) {
      updatedEntries[existingEntryIndex] = {
        ...updatedEntries[existingEntryIndex],
        content: currentEntryContent,
        updatedAt: new Date(),
        relatedTaskIds: completedTasksToday,
      };
      savedEntry = updatedEntries[existingEntryIndex];

    } else {
      const newEntry: JournalEntry = {
        id: `journal-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        date: dateString,
        content: currentEntryContent,
        relatedTaskIds: completedTasksToday,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      savedEntry = newEntry;
      updatedEntries.push(newEntry);
    }

    setEntries(updatedEntries);
    onEntriesChange(updatedEntries); // Notify parent

     toast({
        title: "Journal Entry Saved",
        description: `Your entry for ${format(selectedDate, 'PPP')} has been saved.`,
     });
  };

  const handlePreviousDay = () => {
      const prevDay = new Date(selectedDate);
      prevDay.setDate(selectedDate.getDate() - 1);
      setSelectedDate(startOfDay(prevDay));
  }

  const handleNextDay = () => {
      const nextDay = new Date(selectedDate);
      nextDay.setDate(selectedDate.getDate() + 1);
      setSelectedDate(startOfDay(nextDay));
  }


  if (!isMounted) {
    // Simplified Skeleton for the editor view
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-40" />
                <div className="flex gap-1">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                </div>
            </div>
            <Skeleton className="h-40 w-full" /> {/* Text area skeleton */}
            <div className="flex justify-end">
                <Skeleton className="h-9 w-28" /> {/* Save button skeleton */}
            </div>
        </div>
    );
  }

  // Simplified Layout for Editor - remove Card wrapper if desired, or keep for consistency
  return (
     <div className="space-y-4">
         <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-foreground">Journal - {format(selectedDate, 'PPP')}</h2>
             <div className="flex gap-1">
                 <Button variant="ghost" size="icon" onClick={handlePreviousDay} className="h-8 w-8 text-muted-foreground hover:text-foreground">
                     <ArrowLeft className="h-5 w-5" />
                     <span className="sr-only">Previous Day</span>
                 </Button>
                 <Button variant="ghost" size="icon" onClick={handleNextDay} className="h-8 w-8 text-muted-foreground hover:text-foreground">
                    <ArrowRight className="h-5 w-5" />
                     <span className="sr-only">Next Day</span>
                 </Button>
             </div>
         </div>

        <Textarea
            placeholder={`What did you accomplish on ${format(selectedDate, 'MMM d')}? Reflect on your day...`}
            value={currentEntryContent}
            onChange={(e) => setCurrentEntryContent(e.target.value)}
            rows={10} // Increased rows for better editing experience
            className="w-full bg-input border-border focus:ring-primary text-base" // Use text-base for readability
        />

       <div className="flex justify-end">
         <Button onClick={handleSaveEntry} size="sm">
            <Save className="mr-2 h-4 w-4" /> Save Entry
         </Button>
      </div>
    </div>
  );
}

    