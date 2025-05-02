
"use client";

import type { JournalEntry, Task, JournalContentGrid } from '@/lib/types';
import { useState, useEffect } from 'react';
import { format, parseISO, startOfDay, isValid } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import JournalEditorGrid from './JournalEditorGrid'; // Import the new grid editor

interface JournalSectionProps {
  initialEntries: JournalEntry[];
  tasks: Task[];
  onEntriesChange: (entries: JournalEntry[]) => void;
  // Add props to control editor state from parent (page.tsx)
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onBackToList: () => void; // Add prop to handle going back
}

export default function JournalSection({
    initialEntries,
    tasks,
    onEntriesChange,
    selectedDate, // Receive selected date from parent
    onDateChange, // Receive date change handler from parent
    onBackToList, // Receive back handler from parent
}: JournalSectionProps) {
  const [entries, setEntries] = useState<JournalEntry[]>(initialEntries);
  // State to hold the structured data for the current entry's grid
  const [currentEntryGridData, setCurrentEntryGridData] = useState<JournalContentGrid | undefined>(undefined);
  const [isMounted, setIsMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // Add saving state
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
    // Load entry for the selected date when component mounts or date changes
    loadEntryForDate(selectedDate);
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, entries]); // Reload when date or entries list changes

  useEffect(() => {
     // Update local entries state if initialEntries prop changes
     setEntries(initialEntries);
      // Note: loadEntryForDate is called by the selectedDate effect
   }, [initialEntries]);


  const loadEntryForDate = (date: Date) => {
      const dateString = format(date, 'yyyy-MM-dd');
      const foundEntry = entries.find(entry => {
         try {
            // Ensure consistent date comparison by using startOfDay
            const entryDateValue = typeof entry.date === 'string' ? startOfDay(parseISO(entry.date)) : startOfDay(entry.date);
            return isValid(entryDateValue) && format(entryDateValue, 'yyyy-MM-dd') === dateString;
         } catch (error) {
             console.error("Error parsing date:", entry.date, error);
             return false;
         }
      });
      // Set the grid data from the found entry, or undefined if not found/no grid data
      setCurrentEntryGridData(foundEntry?.contentGrid);
  }

  const handleSaveEntry = (gridData: JournalContentGrid) => {
     setIsSaving(true); // Set saving state
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

    // Calculate related tasks (optional, can be removed if not needed for grid view)
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
      // Update existing entry with new grid data
      updatedEntries[existingEntryIndex] = {
        ...updatedEntries[existingEntryIndex],
        contentGrid: gridData, // Save the grid data
        // Optionally update content if needed, or keep it separate
        // content: convertGridDataToString(gridData), // Example helper function
        updatedAt: new Date(),
        relatedTaskIds: completedTasksToday, // Update related tasks if needed
      };
      savedEntry = updatedEntries[existingEntryIndex];

    } else {
      // Create a new entry with the grid data
      const newEntry: JournalEntry = {
        id: `journal-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        date: dateString,
        contentGrid: gridData,
        // content: convertGridDataToString(gridData), // Optional: populate legacy content field
        relatedTaskIds: completedTasksToday,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      savedEntry = newEntry;
      updatedEntries.push(newEntry);
    }

    setEntries(updatedEntries);
    onEntriesChange(updatedEntries); // Notify parent

    // Simulate save delay for visual feedback (remove in production)
     setTimeout(() => {
         setIsSaving(false); // Reset saving state
         toast({
            title: "Journal Entry Saved",
            description: `Your entry for ${format(selectedDate, 'PPP')} has been saved.`,
         });
     }, 500); // 0.5 second delay
  };

  const handlePreviousDay = () => {
      const prevDay = new Date(selectedDate);
      prevDay.setDate(selectedDate.getDate() - 1);
      onDateChange(startOfDay(prevDay)); // Use parent handler to update date
  }

  const handleNextDay = () => {
      const nextDay = new Date(selectedDate);
      nextDay.setDate(selectedDate.getDate() + 1);
      onDateChange(startOfDay(nextDay)); // Use parent handler to update date
  }


  if (!isMounted) {
    // Use the skeleton from JournalEditorGrid for consistency
    return <JournalEditorGrid selectedDate={selectedDate} initialData={undefined} onSave={()=>{}} onPreviousDay={()=>{}} onNextDay={()=>{}} onBack={()=>{}} />;
  }

  // Render the JournalEditorGrid component
  return (
     <div className="h-full flex flex-col"> {/* Ensure container takes full height */}
        <JournalEditorGrid
          selectedDate={selectedDate}
          initialData={currentEntryGridData}
          onSave={handleSaveEntry}
          onPreviousDay={handlePreviousDay}
          onNextDay={handleNextDay}
          onBack={onBackToList} // Pass the back handler to the grid editor
          isSaving={isSaving} // Pass saving state
        />
     </div>
  );
}

    