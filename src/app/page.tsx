
"use client";

import type { Task, TaskList, JournalEntry } from '@/lib/types';
import { useState, useEffect } from 'react';
import { startOfDay } from 'date-fns';
import TaskListSection from "@/components/tasks/TaskListSection";
import JournalSection from "@/components/journal/JournalSection";
import AppHeader from "@/components/layout/AppHeader";
import BottomNavigation from "@/components/layout/BottomNavigation";
import TaskListTabs from '@/components/tasks/TaskListTabs';
import { Card, CardContent } from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import Greeting from '@/components/journal/Greeting';
import QuoteBlock from '@/components/journal/QuoteBlock';
import WeekCalendar from '@/components/journal/WeekCalendar';
import JournalList from '@/components/journal/JournalList';
import { Separator } from '@/components/ui/separator';

// Mock data - replace with actual data fetching
const mockTaskLists: TaskList[] = [
  { id: 'list-1', name: 'Arcis Topics', createdAt: new Date() },
  { id: 'list-2', name: 'PHYSICS BITSAT', createdAt: new Date() },
  { id: 'list-3', name: 'General', createdAt: new Date() },
];

const mockTasks: Task[] = [
  { id: '1', listId: 'list-1', title: 'Control', priority: 'medium', completed: false, isStarred: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '2', listId: 'list-1', title: 'Stability', priority: 'medium', completed: false, isStarred: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '3', listId: 'list-1', title: 'Deployment', priority: 'low', completed: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '4', listId: 'list-2', title: 'Mechanics Review', priority: 'high', completed: false, createdAt: new Date(), updatedAt: new Date(), dueDate: new Date(Date.now() + 86400000 * 2) },
  { id: '5', listId: 'list-2', title: 'Optics Problems', priority: 'medium', completed: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '6', listId: 'list-3', title: 'Grocery Shopping', priority: 'low', completed: false, createdAt: new Date(), updatedAt: new Date() },
   { id: '7', listId: 'list-1', title: 'Documentation', priority: 'low', completed: true, createdAt: new Date(Date.now() - 86400000 * 3), updatedAt: new Date() }, // Completed 3 days ago
   { id: '8', listId: 'list-1', title: 'Testing', priority: 'medium', completed: true, createdAt: new Date(Date.now() - 86400000 * 2), updatedAt: new Date() }, // Completed 2 days ago
   { id: '9', listId: 'list-1', title: 'Refactoring', priority: 'low', completed: true, createdAt: new Date(Date.now() - 86400000 * 1), updatedAt: new Date() }, // Completed yesterday
   { id: '10', listId: 'list-1', title: 'UI Mockups', priority: 'medium', completed: true, createdAt: new Date(Date.now() - 86400000 * 4), updatedAt: new Date() },
   { id: '11', listId: 'list-1', title: 'API Integration', priority: 'high', completed: true, createdAt: new Date(Date.now() - 86400000 * 5), updatedAt: new Date() },
   { id: '12', listId: 'list-1', title: 'Database Schema', priority: 'high', completed: true, createdAt: new Date(Date.now() - 86400000 * 6), updatedAt: new Date() },
   { id: '13', listId: 'list-1', title: 'User Authentication', priority: 'medium', completed: true, createdAt: new Date(Date.now() - 86400000 * 7), updatedAt: new Date() }, // Completed 1 week ago
];

// Example with contentGrid data
const mockJournalEntries: JournalEntry[] = [
  {
      id: 'j1',
      date: '2024-07-27',
      content: 'Started working on the homepage design.', // Optional legacy content
      contentGrid: {
          commitment: 'Finish the wireframes.',
          gratitude: 'Productive morning coffee.',
          mustDo: '1. Standup meeting\n2. Code review\n3. Update Jira',
          improvement: 'Take more breaks.'
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      relatedTaskIds: ['1']
  },
  {
      id: 'j2',
      date: '2024-07-28',
      content: 'Completed the project documentation draft.',
      contentGrid: { // Add grid data for another day
           commitment: 'Review feedback on docs.',
           gratitude: 'Team collaboration.',
           mustDo: '1. Send docs for review\n2. Plan next sprint\n3. Check emails',
           improvement: 'Delegate the email checking task.'
       },
      createdAt: new Date(),
      updatedAt: new Date(),
      relatedTaskIds: ['3']
  },
  // Add an entry for today without grid data initially
  {
       id: 'j-today',
       date: startOfDay(new Date()).toISOString().split('T')[0], // Today's date string
       content: '', // No initial content
       contentGrid: undefined, // No initial grid data
       createdAt: new Date(),
       updatedAt: new Date(),
   }
];


export default function Home() {
  const [activeView, setActiveView] = useState<'journal' | 'tasks' | 'calendar' | 'search'>('journal'); // Default to journal view
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [taskLists, setTaskLists] = useState<TaskList[]>(mockTaskLists);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(mockJournalEntries);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [isAddListDialogOpen, setIsAddListDialogOpen] = useState(false);
  const [newListName, setNewListName] = useState('');
  // State for Add Journal Dialog
  const [isAddJournalDialogOpen, setIsAddJournalDialogOpen] = useState(false);
  const [newJournalName, setNewJournalName] = useState('');
  // State for the currently selected date in the journal editor
  const [selectedJournalDate, setSelectedJournalDate] = useState<Date>(startOfDay(new Date()));
  // State to control Journal view (list or editor)
  const [journalViewMode, setJournalViewMode] = useState<'list' | 'edit'>('list'); // Default to list view
  const { toast } = useToast();

  useEffect(() => {
      // Set default selected list for Tasks view
      if (activeView === 'tasks' && taskLists.length > 0 && selectedListId === null) {
          setSelectedListId(taskLists[0].id);
      }
      else if (activeView === 'tasks' && taskLists.length === 0) {
          setSelectedListId(null);
      }
      // Ensure journal is in list mode when switching to journal view
      // if (activeView === 'journal') {
      //    setJournalViewMode('list');
      // }
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskLists, activeView]);

  const handleUpdateTasks = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
  };

  const handleUpdateTaskLists = (updatedTaskLists: TaskList[]) => {
    setTaskLists(updatedTaskLists);
  }

  const handleUpdateJournalEntries = (updatedEntries: JournalEntry[]) => {
    setJournalEntries(updatedEntries);
     // Keep the editor view active after saving
     setJournalViewMode('edit');
  }

  const handleSelectList = (listId: string | null) => {
      setSelectedListId(listId);
  }

   const handleAddListClick = () => {
        setNewListName('');
        setIsAddListDialogOpen(true);
   };

   const handleSaveNewList = () => {
        if (!newListName.trim()) {
            toast({ title: "Error", description: "List name cannot be empty.", variant: "destructive" });
            return;
        }
        const newList: TaskList = {
            id: `list-${Date.now()}-${Math.random().toString(16).slice(2)}`,
            name: newListName.trim(),
            createdAt: new Date(),
        };
        const updatedLists = [...taskLists, newList];
        setTaskLists(updatedLists);
        setSelectedListId(newList.id); // Automatically select the new list
        setIsAddListDialogOpen(false);
        toast({ title: "List Created", description: `"${newList.name}" added.` });
    };

    // Handler for date changes in the Journal editor
    const handleJournalDateChange = (newDate: Date) => {
        setSelectedJournalDate(startOfDay(newDate));
        // Optionally switch to editor view if a date is selected in the calendar?
        // setJournalViewMode('edit');
    };

    // Handler to switch to Journal Editor view (e.g., when clicking a journal book)
    const handleJournalClick = (entry?: JournalEntry) => {
        // If an entry is provided, set the date to that entry's date
        // Otherwise, default to today for the new entry grid
        const dateToEdit = entry?.date ? startOfDay(new Date(entry.date)) : startOfDay(new Date());
        setSelectedJournalDate(dateToEdit);
        setJournalViewMode('edit');
    };

    // Handler to reset Journal view to List mode
    const resetJournalView = () => {
        setJournalViewMode('list');
        // Maybe reset selected date to today when going back to list?
        // setSelectedJournalDate(startOfDay(new Date()));
    };

    // Handler to open the Add Journal dialog
    const handleAddJournalClick = () => {
        setNewJournalName('');
        setIsAddJournalDialogOpen(true);
    };

    // Handler to save the new journal (Placeholder - currently only shows a toast)
    const handleSaveNewJournal = () => {
        if (!newJournalName.trim()) {
            toast({ title: "Error", description: "Journal name cannot be empty.", variant: "destructive" });
            return;
        }
        // In a real app, you would create a new journal 'book' here
        // and update the state holding the list of journals.
        // For now, just show a toast and close the dialog.
        toast({ title: "Journal Added", description: `Journal "${newJournalName.trim()}" created (simulation).` });
        setIsAddJournalDialogOpen(false);
        // Example:
        // const newJournal = { id: `journal-book-${Date.now()}`, title: newJournalName.trim(), imageUrl: '...' };
        // setJournalBooks([...journalBooks, newJournal]);
    };

  return (
    <div className="flex flex-col h-screen"> {/* Use h-screen for full height */}
      <AppHeader journalEntries={journalEntries} />

      {/* Conditional Rendering of Task List Tabs Header */}
      {activeView === 'tasks' && (
         <div className="px-4 md:px-6 pt-3 sticky top-16 z-10 bg-background border-b border-border pb-3"> {/* Adjusted sticky top */}
            <TaskListTabs
                lists={taskLists}
                selectedListId={selectedListId}
                onSelectList={handleSelectList}
                onAddList={handleAddListClick}
             />
         </div>
       )}


       {/* Main Content Area */}
      {/* Adjust padding and flex behavior */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 pb-20"> {/* Added overflow-y-auto */}

        {/* Journal View */}
        {activeView === 'journal' && (
            <>
                {journalViewMode === 'list' && (
                     <div className="space-y-6">
                        <Greeting />
                        <QuoteBlock />
                        <WeekCalendar selectedDate={selectedJournalDate} onDateSelect={handleJournalDateChange} />
                        <Separator />
                        <JournalList
                            entries={journalEntries}
                            onJournalClick={handleJournalClick} // Pass handler to navigate to editor
                            onAddJournal={handleAddJournalClick} // Pass handler to add journal
                        />
                     </div>
                )}
                 {journalViewMode === 'edit' && (
                     <JournalSection
                        initialEntries={journalEntries}
                        tasks={tasks}
                        onEntriesChange={handleUpdateJournalEntries}
                        selectedDate={selectedJournalDate}
                        onDateChange={handleJournalDateChange}
                        onBackToList={resetJournalView} // Pass the function to go back
                     />
                 )}
            </>
        )}

         {/* Tasks View */}
         {activeView === 'tasks' && (
             <TaskListSection
                initialTasks={tasks}
                initialTaskLists={taskLists}
                selectedListId={selectedListId}
                onTasksChange={handleUpdateTasks}
                onTaskListsChange={handleUpdateTaskLists}
                onSelectListChange={handleSelectList} // Pass handler for list changes (like deletion)
             />
         )}

         {/* Calendar View Placeholder */}
         {activeView === 'calendar' && (
             <Card><CardContent className="pt-6"><p className="text-muted-foreground">Calendar view coming soon...</p></CardContent></Card>
         )}

         {/* Search View Placeholder */}
        {activeView === 'search' && (
             <Card><CardContent className="pt-6"><p className="text-muted-foreground">Search functionality coming soon...</p></CardContent></Card>
         )}

      </main>

        {/* Add List Dialog */}
        <AlertDialog open={isAddListDialogOpen} onOpenChange={setIsAddListDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Create New Task List</AlertDialogTitle>
                <AlertDialogDescription>
                    Enter a name for your new task list.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <Input
                    placeholder="List Name"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveNewList()}
                    className="my-4"
                />
                <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleSaveNewList}>Create</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

         {/* Add Journal Dialog */}
        <AlertDialog open={isAddJournalDialogOpen} onOpenChange={setIsAddJournalDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Create New Journal</AlertDialogTitle>
                <AlertDialogDescription>
                    Enter a name for your new journal book.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <Input
                    placeholder="Journal Name"
                    value={newJournalName}
                    onChange={(e) => setNewJournalName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveNewJournal()}
                    className="my-4"
                />
                <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleSaveNewJournal}>Create</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>


      {/* Sticky Bottom Navigation */}
      {/* Ensure Bottom Navigation doesn't overlap content */}
      <div className="mt-auto"> {/* Push navigation to bottom */}
        <BottomNavigation activeView={activeView} setActiveView={setActiveView} />
      </div>
    </div>
  );
}
