
"use client";

import type { Task, TaskList, JournalEntry } from '@/lib/types';
import { useState, useEffect } from 'react';
import TaskListSection from "@/components/tasks/TaskListSection"; // Import task list component
import JournalSection from "@/components/journal/JournalSection";
import AppHeader from "@/components/layout/AppHeader";
import BottomNavigation from "@/components/layout/BottomNavigation";
import TaskListTabs from '@/components/tasks/TaskListTabs'; // Import tabs component
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
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"; // Import AlertDialog components
import { Input } from "@/components/ui/input"; // Import Input for Add List Dialog
import { useToast } from "@/hooks/use-toast"; // Import useToast


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

export default function Home() {
  const [activeView, setActiveView] = useState<'journal' | 'tasks' | 'calendar' | 'search'>('tasks'); // Default to tasks view
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [taskLists, setTaskLists] = useState<TaskList[]>(mockTaskLists);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(mockJournalEntries); // Add state for journal entries
  const [selectedListId, setSelectedListId] = useState<string | null>(null); // Initialize to null
  const [isAddListDialogOpen, setIsAddListDialogOpen] = useState(false); // Add list dialog state moved here
  const [newListName, setNewListName] = useState(''); // New list name state moved here
  const { toast } = useToast(); // Initialize toast

  // Effect to set the initial selected list ID once lists are loaded
  useEffect(() => {
      if (taskLists.length > 0 && selectedListId === null) {
          setSelectedListId(taskLists[0].id);
      }
      // If all lists are deleted, set selectedListId to null
      else if (taskLists.length === 0) {
          setSelectedListId(null);
      }
  }, [taskLists, selectedListId]); // Re-run when taskLists change or selectedListId is still null


  // Handlers to update state (to be passed down)
  const handleUpdateTasks = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
    // TODO: Persist changes
  };

  const handleUpdateTaskLists = (updatedTaskLists: TaskList[]) => {
    setTaskLists(updatedTaskLists);
    // TODO: Persist changes
  }

  const handleUpdateJournalEntries = (updatedEntries: JournalEntry[]) => {
    setJournalEntries(updatedEntries);
    // TODO: Persist changes
  }

  const handleSelectList = (listId: string | null) => { // Allow null
      setSelectedListId(listId);
  }

   // Handlers for Add List Dialog moved from TaskListSection
   const handleAddListClick = () => {
        setNewListName(''); // Reset name field
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
        setTaskLists(updatedLists); // Update state here
        setSelectedListId(newList.id); // Select the newly added list
        setIsAddListDialogOpen(false);
        toast({ title: "List Created", description: `"${newList.name}" added.` });
        // TODO: API call to create list
    };

   // Note: handleDeleteListClick, confirmDeleteList handlers remain in TaskListSection
   // as they are triggered from within that component's dropdown.


  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader journalEntries={journalEntries} /> {/* Pass journal entries to header */}

      {/* Render TaskListTabs below header only for 'tasks' view */}
      {activeView === 'tasks' && (
         <div className="px-4 md:px-6 pt-3 sticky top-[calc(4rem)] z-10 bg-background border-b border-border pb-3"> {/* Adjust top position & add border */}
            <TaskListTabs
                lists={taskLists}
                selectedListId={selectedListId}
                onSelectList={handleSelectList}
                onAddList={handleAddListClick} // Pass add list handler
             />
         </div>
       )}


      <main className="flex-1 p-4 md:p-6 space-y-4">
         {/* Removed blockquote, week view, and separator */}

        {/* Main content area - Render components based on activeView */}
        {activeView === 'journal' && (
             <JournalSection
                initialEntries={journalEntries}
                tasks={tasks}
                onEntriesChange={handleUpdateJournalEntries} // Pass update handler
            />
         )}
         {activeView === 'tasks' && (
            // No need to wrap TaskListSection in AlertDialog here anymore
             <TaskListSection
                initialTasks={tasks}
                initialTaskLists={taskLists}
                selectedListId={selectedListId} // Pass selectedListId
                onTasksChange={handleUpdateTasks}
                onTaskListsChange={handleUpdateTaskLists}
                onSelectListChange={handleSelectList} // Pass list selection handler
             />
         )}
         {activeView === 'calendar' && (
             <Card><CardContent className="pt-6"><p className="text-muted-foreground">Calendar view coming soon...</p></CardContent></Card>
         )}
        {activeView === 'search' && (
             <Card><CardContent className="pt-6"><p className="text-muted-foreground">Search functionality coming soon...</p></CardContent></Card>
         )}

      </main>

        {/* Add List Dialog (Managed by this page component) */}
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
                    className="my-4" // Add margin
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
