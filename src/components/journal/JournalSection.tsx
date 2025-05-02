"use client";

import type { JournalEntry, Task } from '@/lib/types';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { format, parseISO, startOfDay } from 'date-fns';
import { Save, ArrowLeft, ArrowRight } from 'lucide-react'; // Added arrows
import { useToast } from "@/hooks/use-toast"; // Import useToast
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton

interface JournalSectionProps {
  initialEntries: JournalEntry[];
  tasks: Task[]; // Pass tasks to potentially link them
}

export default function JournalSection({ initialEntries, tasks }: JournalSectionProps) {
  const [entries, setEntries] = useState<JournalEntry[]>(initialEntries);
  const [currentEntryContent, setCurrentEntryContent] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date())); // Default to today
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast(); // Initialize toast

  useEffect(() => {
    setIsMounted(true);
    // Load entry for the selected date when component mounts or date changes
    loadEntryForDate(selectedDate);
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, initialEntries]); // Rerun when selectedDate or initialEntries change


  const loadEntryForDate = (date: Date) => {
      const dateString = format(date, 'yyyy-MM-dd');
      const foundEntry = entries.find(entry => {
         try {
            // Handle both Date and string types for entry.date
            const entryDate = typeof entry.date === 'string' ? parseISO(entry.date) : entry.date;
            return format(entryDate, 'yyyy-MM-dd') === dateString;
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
            const entryDate = typeof entry.date === 'string' ? parseISO(entry.date) : entry.date;
            return format(entryDate, 'yyyy-MM-dd') === dateString;
        } catch (error) {
            console.error("Error parsing date:", entry.date, error);
            return false;
        }
    });


    const completedTasksToday = tasks.filter(task =>
        task.completed && task.dueDate && format(new Date(task.dueDate), 'yyyy-MM-dd') === dateString
    ).map(task => task.id);


    let savedEntry: JournalEntry | null = null;

    if (existingEntryIndex > -1) {
      // Update existing entry
      const updatedEntries = [...entries];
      updatedEntries[existingEntryIndex] = {
        ...updatedEntries[existingEntryIndex],
        content: currentEntryContent,
        updatedAt: new Date(),
        relatedTaskIds: completedTasksToday, // Update related tasks
      };
      savedEntry = updatedEntries[existingEntryIndex];
      setEntries(updatedEntries);
      // TODO: API call to update entry
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
      setEntries([...entries, newEntry]);
      // TODO: API call to create entry
      console.log("New journal entry created:", newEntry);
    }
    // Show toast notification
     toast({
        title: "Journal Entry Saved",
        description: `Your entry for ${format(selectedDate, 'PPP')} has been saved.`,
     });
  };

  // Basic date change handlers (replace with a proper date picker later)
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
    // Use skeleton loader matching the card structure
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

  // No longer displaying tasks list here

  return (
    <Card className="bg-card border-none shadow-none"> {/* Match dark theme */}
      <CardHeader className="pb-2">
         <div className="flex justify-between items-center">
            <CardTitle className="text-xl text-foreground">Journal - {format(selectedDate, 'PPP')}</CardTitle> {/* Format date nicely */}
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
         {/* Removed Today's Tasks section */}

        <div>
            <h3 className="text-base font-medium mb-2 text-muted-foreground">Your Entry</h3>
            <Textarea
                placeholder={`What did you accomplish on ${format(selectedDate, 'MMM d')}? Reflect on your day...`}
                value={currentEntryContent}
                onChange={(e) => setCurrentEntryContent(e.target.value)}
                rows={8} // Reduced rows slightly
                className="w-full bg-input border-border focus:ring-primary" // Style textarea for dark theme
            />
        </div>

      </CardContent>
       <CardFooter className="flex justify-end pt-4">
         <Button onClick={handleSaveEntry} size="sm"> {/* Smaller save button */}
            <Save className="mr-2 h-4 w-4" /> Save Entry
         </Button>
      </CardFooter>
    </Card>
  );
}
