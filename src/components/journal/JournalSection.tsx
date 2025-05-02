"use client";

import type { JournalEntry, Task } from '@/lib/types';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { format, parseISO, startOfDay } from 'date-fns';
import { PlusCircle, Save } from 'lucide-react';

interface JournalSectionProps {
  initialEntries: JournalEntry[];
  tasks: Task[]; // Pass tasks to potentially link them
}

export default function JournalSection({ initialEntries, tasks }: JournalSectionProps) {
  const [entries, setEntries] = useState<JournalEntry[]>(initialEntries);
  const [currentEntryContent, setCurrentEntryContent] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date())); // Default to today
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Load entry for the selected date when component mounts or date changes
    loadEntryForDate(selectedDate);
  }, [selectedDate, initialEntries]); // Rerun when selectedDate or initialEntries change


  const loadEntryForDate = (date: Date) => {
      const dateString = format(date, 'yyyy-MM-dd');
      const foundEntry = entries.find(entry => format(parseISO(entry.date as string), 'yyyy-MM-dd') === dateString);
      setCurrentEntryContent(foundEntry ? foundEntry.content : '');
  }

  const handleSaveEntry = () => {
     const dateString = format(selectedDate, 'yyyy-MM-dd');
    const existingEntryIndex = entries.findIndex(entry => format(parseISO(entry.date as string), 'yyyy-MM-dd') === dateString);

    const completedTasksToday = tasks.filter(task =>
        task.completed && task.dueDate && format(new Date(task.dueDate), 'yyyy-MM-dd') === dateString
    ).map(task => task.id);


    if (existingEntryIndex > -1) {
      // Update existing entry
      const updatedEntries = [...entries];
      updatedEntries[existingEntryIndex] = {
        ...updatedEntries[existingEntryIndex],
        content: currentEntryContent,
        updatedAt: new Date(),
        relatedTaskIds: completedTasksToday, // Update related tasks
      };
      setEntries(updatedEntries);
      // TODO: API call to update entry
      console.log("Journal entry updated:", updatedEntries[existingEntryIndex]);

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
      setEntries([...entries, newEntry]);
      // TODO: API call to create entry
      console.log("New journal entry created:", newEntry);
    }
     alert("Journal entry saved!"); // Replace with toast notification
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
    return <div className="p-4 bg-muted rounded-lg animate-pulse h-64"></div>; // Skeleton loader
  }

  const todaysTasks = tasks.filter(task =>
    task.dueDate && format(new Date(task.dueDate), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
  );


  return (
    <Card>
      <CardHeader>
         <div className="flex justify-between items-center">
            <CardTitle>Journal - {format(selectedDate, 'PPP')}</CardTitle> {/* Format date nicely */}
             <div className="flex gap-2">
                 <Button variant="outline" size="sm" onClick={handlePreviousDay}>Previous Day</Button>
                 <Button variant="outline" size="sm" onClick={handleNextDay}>Next Day</Button>
             </div>
         </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
             <h3 className="text-lg font-medium mb-2">Today's Tasks ({format(selectedDate, 'yyyy-MM-dd')})</h3>
             {todaysTasks.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1 text-sm">
                {todaysTasks.map(task => (
                    <li key={task.id} className={task.completed ? 'text-muted-foreground line-through' : ''}>
                    {task.title} - <span className="text-xs capitalize">({task.priority})</span> {task.completed ? '(Completed)' : ''}
                    </li>
                ))}
                </ul>
            ) : (
                <p className="text-sm text-muted-foreground">No tasks scheduled for this day.</p>
            )}
        </div>

        <div>
            <h3 className="text-lg font-medium mb-2">Your Entry</h3>
            <Textarea
                placeholder={`What did you accomplish on ${format(selectedDate, 'MMM d')}? Reflect on your day...`}
                value={currentEntryContent}
                onChange={(e) => setCurrentEntryContent(e.target.value)}
                rows={10}
                className="w-full"
            />
        </div>

      </CardContent>
       <CardFooter className="flex justify-end">
         <Button onClick={handleSaveEntry}>
            <Save className="mr-2 h-4 w-4" /> Save Entry
         </Button>
      </CardFooter>
    </Card>
  );
}
