
"use client";

import type { JournalContentGrid } from '@/lib/types';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { Save, ChevronLeft, ChevronRight, Sun, Smile, Tag } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface JournalEditorGridProps {
  selectedDate: Date;
  initialData: JournalContentGrid | undefined;
  onSave: (data: JournalContentGrid) => void;
  onPreviousDay: () => void;
  onNextDay: () => void;
  isSaving?: boolean; // Optional saving indicator
}

export default function JournalEditorGrid({
  selectedDate,
  initialData,
  onSave,
  onPreviousDay,
  onNextDay,
  isSaving = false,
}: JournalEditorGridProps) {
  const [commitment, setCommitment] = useState('');
  const [gratitude, setGratitude] = useState('');
  const [mustDo, setMustDo] = useState('');
  const [improvement, setImprovement] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Load initial data when component mounts or initialData changes
    setCommitment(initialData?.commitment || '');
    setGratitude(initialData?.gratitude || '');
    setMustDo(initialData?.mustDo || '');
    setImprovement(initialData?.improvement || '');
  }, [initialData]);

  const handleSaveClick = () => {
    const currentData: JournalContentGrid = {
      commitment,
      gratitude,
      mustDo,
      improvement,
    };
    onSave(currentData);
  };

  if (!isMounted) {
    // Skeleton loader for the grid
    return (
      <div className="flex flex-col h-full space-y-4 p-1">
          {/* Header Skeleton */}
           <div className="flex items-center justify-between mb-4">
                <div className="flex items-end gap-2">
                    <Skeleton className="h-10 w-8" />
                    <div className="flex flex-col gap-1">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                     {/* Icons Placeholder */}
                     <Skeleton className="h-6 w-6 rounded-full" />
                     <Skeleton className="h-6 w-6 rounded-full" />
                     <Skeleton className="h-6 w-6 rounded-full" />
                     {/* Nav Buttons Placeholder */}
                     <Skeleton className="h-8 w-8" />
                     <Skeleton className="h-8 w-8" />
                     {/* Save Button Placeholder */}
                    <Skeleton className="h-9 w-9 rounded-full" />
                </div>
           </div>
           {/* Grid Skeleton */}
           <div className="grid grid-cols-2 grid-rows-2 gap-4 flex-grow">
              <Skeleton className="h-full w-full rounded-md" />
              <Skeleton className="h-full w-full rounded-md" />
              <Skeleton className="h-full w-full rounded-md" />
              <Skeleton className="h-full w-full rounded-md" />
           </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-4 p-1"> {/* Reduced padding */}
      {/* Header */}
      <div className="flex items-center justify-between mb-2"> {/* Reduced bottom margin */}
        {/* Date Display */}
        <div className="flex items-end gap-2">
          <span className="text-4xl font-bold text-foreground">{format(selectedDate, 'd')}</span>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-medium text-muted-foreground">{format(selectedDate, 'EEEE')}</span>
            <span className="text-sm text-muted-foreground">{format(selectedDate, 'MMMM yyyy')}</span>
          </div>
        </div>

        {/* Icons & Navigation */}
        <div className="flex items-center gap-2">
           {/* Mood/Tag Icons (Placeholders) */}
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <Sun className="h-5 w-5" />
              <span className="sr-only">Mood: Sunny</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <Smile className="h-5 w-5" />
              <span className="sr-only">Mood: Happy</span>
            </Button>
             <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <Tag className="h-5 w-5" />
              <span className="sr-only">Add Tag</span>
            </Button>

           {/* Day Navigation */}
           <Button variant="ghost" size="icon" onClick={onPreviousDay} className="h-8 w-8 text-muted-foreground hover:text-foreground">
             <ChevronLeft className="h-5 w-5" />
             <span className="sr-only">Previous Day</span>
           </Button>
           <Button variant="ghost" size="icon" onClick={onNextDay} className="h-8 w-8 text-muted-foreground hover:text-foreground">
             <ChevronRight className="h-5 w-5" />
             <span className="sr-only">Next Day</span>
           </Button>
           {/* Save Button (replaces Add/Plus button) */}
           <Button
               variant="default" // Use default variant for save
               size="icon"
               onClick={handleSaveClick}
               disabled={isSaving}
               className="h-9 w-9 rounded-full" // Make it circular
            >
               <Save className="h-5 w-5" />
               <span className="sr-only">Save Entry</span>
            </Button>
        </div>
      </div>

      {/* Editor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px flex-grow bg-border overflow-hidden rounded-md"> {/* Use gap-px and bg-border for lines */}
        {/* Top Left */}
        <div className="bg-background p-3 md:p-4 flex flex-col">
          <label htmlFor="commitment" className="text-sm font-medium text-muted-foreground mb-2">Today, I commit to:</label>
          <Textarea
            id="commitment"
            placeholder="..."
            value={commitment}
            onChange={(e) => setCommitment(e.target.value)}
            className="flex-grow resize-none border-none focus:ring-0 bg-transparent p-0 text-base focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        {/* Top Right */}
        <div className="bg-background p-3 md:p-4 flex flex-col">
          <label htmlFor="gratitude" className="text-sm font-medium text-muted-foreground mb-2">Today, I am grateful for:</label>
          <Textarea
            id="gratitude"
            placeholder="..."
            value={gratitude}
            onChange={(e) => setGratitude(e.target.value)}
            className="flex-grow resize-none border-none focus:ring-0 bg-transparent p-0 text-base focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        {/* Bottom Left */}
        <div className="bg-background p-3 md:p-4 flex flex-col">
          <label htmlFor="mustDo" className="text-sm font-medium text-muted-foreground mb-2">Three things I must do today:</label>
          <Textarea
            id="mustDo"
             placeholder="1. ...&#10;2. ...&#10;3. ..." // Use HTML entity for newline in placeholder
            value={mustDo}
            onChange={(e) => setMustDo(e.target.value)}
            className="flex-grow resize-none border-none focus:ring-0 bg-transparent p-0 text-base focus-visible:ring-0 focus-visible:ring-offset-0"
            rows={5} // Give slightly more initial space
          />
        </div>
        {/* Bottom Right */}
        <div className="bg-background p-3 md:p-4 flex flex-col">
          <label htmlFor="improvement" className="text-sm font-medium text-muted-foreground mb-2">How could I have made today better?</label>
          <Textarea
            id="improvement"
            placeholder="..."
            value={improvement}
            onChange={(e) => setImprovement(e.target.value)}
            className="flex-grow resize-none border-none focus:ring-0 bg-transparent p-0 text-base focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
      </div>
    </div>
  );
}
