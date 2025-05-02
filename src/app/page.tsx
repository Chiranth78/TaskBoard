
"use client";

import type { Task, TaskList, JournalEntry } from '@/lib/types';
import { useState, useEffect } from 'react';
import TaskListSection from "@/components/tasks/TaskListSection";
import JournalSection from "@/components/journal/JournalSection"; // Keep for editing
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
import Greeting from '@/components/journal/Greeting'; // Import Greeting
import QuoteBlock from '@/components/journal/QuoteBlock'; // Import QuoteBlock
import WeekCalendar from '@/components/journal/WeekCalendar'; // Import WeekCalendar
import JournalList from '@/components/journal/JournalList'; // Import JournalList
import { Separator } from '@/components/ui/separator'; // Import Separator

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

const mockJournalEntries: JournalEntry[] = [
  { id: 'j1', date: '2024-07-27', content: 'Started working on the homepage design.', createdAt: new Date(), updatedAt: new Date(), relatedTaskIds: ['1'] },
  { id: 'j2', date: '2024-07-28', content: 'Completed the project documentation draft.', createdAt: new Date(), updatedAt: new Date(), relatedTaskIds: ['3'] },
];

// Mock data for the journal list view
const mockJournalsList = [
    { id: 'my-journal-1', name: 'My journal', imageUrl: 'https://picsum.photos/300/200?random=1', dataAiHint: 'journal cover abstract' },
    // Add more journals if needed
];

export default function Home() {
  const [activeView, setActiveView] = useState<'journal' | 'tasks' | 'calendar' | 'search'>('tasks');
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [taskLists, setTaskLists] = useState<TaskList[]>(mockTaskLists);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(mockJournalEntries);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [isAddListDialogOpen, setIsAddListDialogOpen] = useState(false);
  const [newListName, setNewListName] = useState('');
  // State to track if we are viewing the journal list or the entry editor
  const [journalViewMode, setJournalViewMode] = useState<'list' | 'edit'>('list');
  const { toast } = useToast();

  useEffect(() => {
      if (taskLists.length > 0 && selectedListId === null) {
          setSelectedListId(taskLists[0].id);
      }
      else if (taskLists.length === 0) {
          setSelectedListId(null);
      }
  }, [taskLists, selectedListId]);

  // Reset journal view mode when switching main activeView
  useEffect(() => {
    if (activeView !== 'journal') {
        setJournalViewMode('list');
    } else {
        setJournalViewMode('list'); // Default to list when entering journal view
    }
  }, [activeView]);


  const handleUpdateTasks = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
  };

  const handleUpdateTaskLists = (updatedTaskLists: TaskList[]) => {
    setTaskLists(updatedTaskLists);
  }

  const handleUpdateJournalEntries = (updatedEntries: JournalEntry[]) => {
    setJournalEntries(updatedEntries);
     // Optionally switch back to list view after saving an entry
     // setJournalViewMode('list');
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
        setSelectedListId(newList.id);
        setIsAddListDialogOpen(false);
        toast({ title: "List Created", description: `"${newList.name}" added.` });
    };

    // Handler to switch to the journal entry editor view
    const handleViewJournalEntry = () => {
        setJournalViewMode('edit');
    };


  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader journalEntries={journalEntries} />

      {activeView === 'tasks' && (
         <div className="px-4 md:px-6 pt-3 sticky top-[calc(4rem)] z-10 bg-background border-b border-border pb-3">
            <TaskListTabs
                lists={taskLists}
                selectedListId={selectedListId}
                onSelectList={handleSelectList}
                onAddList={handleAddListClick}
             />
         </div>
       )}


      <main className="flex-1 p-4 md:p-6 space-y-4">

        {/* Journal View */}
        {activeView === 'journal' && (
            <>
                {journalViewMode === 'list' ? (
                    // Display the Journal List layout (Greeting, Quote, Calendar, List)
                    <div className="space-y-6">
                        <Greeting />
                        <QuoteBlock
                            quote="One way to get the most out of life is to look upon it as an adventure."
                            author="William Feather"
                        />
                        <WeekCalendar />
                        <Separator className="my-4" />
                        <JournalList journals={mockJournalsList} onViewJournal={handleViewJournalEntry} />
                    </div>
                ) : (
                    // Display the Journal Entry Editor
                    <JournalSection
                        initialEntries={journalEntries}
                        tasks={tasks}
                        onEntriesChange={handleUpdateJournalEntries}
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
                onSelectListChange={handleSelectList}
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
                <AlertDialogTitle>Create New List</AlertDialogTitle>
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


      {/* Sticky Bottom Navigation */}
      <BottomNavigation activeView={activeView} setActiveView={setActiveView} />
    </div>
  );
}

    