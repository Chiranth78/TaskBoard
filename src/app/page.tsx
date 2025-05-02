
"use client";

import type { Task, TaskList, JournalEntry } from '@/lib/types';
import { useState } from 'react';
import TaskListSection from "@/components/tasks/TaskListSection"; // Import task list component
import JournalSection from "@/components/journal/JournalSection";
import AppHeader from "@/components/layout/AppHeader";
import BottomNavigation from "@/components/layout/BottomNavigation";
import TaskListTabs from '@/components/tasks/TaskListTabs'; // Import tabs component
import { Card, CardContent } from "@/components/ui/card";
// import { Separator } from '@/components/ui/separator'; // Removed separator

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
  const [selectedListId, setSelectedListId] = useState<string | null>(
      taskLists.length > 0 ? taskLists[0].id : null // Initialize selected list
  );
   const [isAddListDialogOpen, setIsAddListDialogOpen] = useState(false); // Add list dialog state moved here
   const [newListName, setNewListName] = useState(''); // New list name state moved here

  // Handlers to update state (to be passed down)
  const handleUpdateTasks = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
    // TODO: Persist changes
  };

  const handleUpdateTaskLists = (updatedTaskLists: TaskList[]) => {
    setTaskLists(updatedTaskLists);
    // TODO: Persist changes
  }

  const handleSelectList = (listId: string) => {
      setSelectedListId(listId);
  }

   // Handlers moved from TaskListSection
   const handleAddListClick = () => {
        setNewListName(''); // Reset name field
        setIsAddListDialogOpen(true);
   };

   // Note: handleSaveNewList, handleDeleteListClick, confirmDeleteList
   // would also need to be moved here if list management (add/delete)
   // functionality should be triggered from the top TaskListTabs area.
   // For now, keeping list add/delete within TaskListSection might be simpler.
   // If list management is moved here, pass necessary state/handlers down.


  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />

      {/* Render TaskListTabs below header only for 'tasks' view */}
      {activeView === 'tasks' && (
         <div className="px-4 md:px-6 pt-3 sticky top-[calc(4rem+1px)] z-10 bg-background"> {/* Adjust top position based on header height */}
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
             <JournalSection initialEntries={mockJournalEntries} tasks={tasks} />
         )}
         {activeView === 'tasks' && (
             <TaskListSection
                initialTasks={tasks}
                initialTaskLists={taskLists}
                selectedListId={selectedListId} // Pass selectedListId
                onTasksChange={handleUpdateTasks}
                onTaskListsChange={handleUpdateTaskLists}
                onSelectListChange={handleSelectList} // Pass list selection handler if needed inside section
             />
         )}
         {activeView === 'calendar' && (
             <Card><CardContent className="pt-6"><p className="text-muted-foreground">Calendar view coming soon...</p></CardContent></Card>
         )}
        {activeView === 'search' && (
             <Card><CardContent className="pt-6"><p className="text-muted-foreground">Search functionality coming soon...</p></CardContent></Card>
         )}

      </main>

      {/* Sticky Bottom Navigation */}
      <BottomNavigation activeView={activeView} setActiveView={setActiveView} />
    </div>
  );
}
