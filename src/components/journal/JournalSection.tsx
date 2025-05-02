
"use client";

import type { JournalEntry, Task } from '@/lib/types'; // Task type might have changed slightly
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { format, parseISO, startOfDay, isValid } from 'date-fns'; // Added isValid
import { Save, ArrowLeft, ArrowRight } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface JournalSectionProps {
  initialEntries: JournalEntry[];
  tasks: Task[]; // Pass tasks to potentially link them
  onEntriesChange: (entries: JournalEntry[]) => void; // Add callback prop
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
  }, [selectedDate]); // Only depend on selectedDate, initialEntries load handled below


   // Update local state if initial props change
   useEffect(() => {
     setEntries(initialEntries);
     // Reload content if the initial entries changed for the currently selected date
     loadEntryForDate(selectedDate);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [initialEntries]);


  const loadEntryForDate = (date: Date) => {
      const dateString = format(date, 'yyyy-MM-dd');
      const foundEntry = entries.find(entry => {
         try {
            // Use startOfDay for comparison to avoid time zone issues if dates are stored with time
            const entryDateValue = typeof entry.date === 'string' ? startOfDay(parseISO(entry.date)) : startOfDay(entry.date);
            // Check if entryDateValue is a valid date before formatting
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


    // Filter tasks completed on the selected date
    const completedTasksToday = tasks.filter(task => {
        if (!task.completed || !task.updatedAt) return false; // Use updatedAt for completion date
        try {
            // Ensure updatedAt is treated as Date before formatting
            const completedDate = typeof task.updatedAt === 'string' ? parseISO(task.updatedAt) : task.updatedAt;
             return isValid(completedDate) && format(startOfDay(completedDate), 'yyyy-MM-dd') === dateString;
        } catch (error) {
            console.error("Error parsing task completion date:", task.updatedAt, error);
            return false;
        }
    }).map(task => task.id);


    let savedEntry: JournalEntry | null = null;
    let updatedEntries: JournalEntry[] = [...entries]; // Create a copy to modify

    if (existingEntryIndex > -1) {
      // Update existing entry
      updatedEntries[existingEntryIndex] = {
        ...updatedEntries[existingEntryIndex],
        content: currentEntryContent,
        updatedAt: new Date(),
        relatedTaskIds: completedTasksToday, // Update related tasks
      };
      savedEntry = updatedEntries[existingEntryIndex];
      console.log("Journal entry updated:", savedEntry);

    } else {
      // Create new entry
      const newEntry: JournalEntry = {
        id: `journal-${Date.now()}-${Math.random().toString(16).slice(2)}`, // Temporary unique ID
        date: dateString,
        content: currentEntryContent,
        relatedTaskIds: completedTasksToday,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      savedEntry = newEntry;
      updatedEntries.push(newEntry); // Add new entry to the copied array
      console.log("New journal entry created:", newEntry);
    }

    setEntries(updatedEntries); // Update local state
    onEntriesChange(updatedEntries); // Notify parent component of the change

     toast({
        title: "Journal Entry Saved",
        description: `Your entry for ${format(selectedDate, 'PPP')} has been saved.`,
     });
    // TODO: API call to update/create entry
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
    return (
        <Card className="bg-card border-none shadow-none">
          <CardHeader className="pb-2">
             <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-40" />
                 <div className="flex gap-2">
                     <Skeleton className="h-8 w-8" />
                     <Skeleton className="h-8 w-8" />
                 </div>
             </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
             <Skeleton className="h-4 w-3/4 mb-2" />
             <Skeleton className="h-32 w-full" />
          </CardContent>
           <CardFooter className="flex justify-end pt-4">
             <Skeleton className="h-9 w-28" />
           </CardFooter>
        </Card>
    );
  }

  return (
    <Card className="bg-card border-none shadow-none">
      <CardHeader className="pb-2">
         <div className="flex justify-between items-center">
            <CardTitle className="text-xl text-foreground">Journal - {format(selectedDate, 'PPP')}</CardTitle>
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
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div>
            <h3 className="text-base font-medium mb-2 text-muted-foreground">Your Entry</h3>
            <Textarea
                placeholder={`What did you accomplish on ${format(selectedDate, 'MMM d')}? Reflect on your day...`}
                value={currentEntryContent}
                onChange={(e) => setCurrentEntryContent(e.target.value)}
                rows={8}
                className="w-full bg-input border-border focus:ring-primary"
            />
        </div>

      </CardContent>
       <CardFooter className="flex justify-end pt-4">
         <Button onClick={handleSaveEntry} size="sm">
            <Save className="mr-2 h-4 w-4" /> Save Entry
         </Button>
      </CardFooter>
    </Card>
  );
}
