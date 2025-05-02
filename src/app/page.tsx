
"use client";

import type { Task, TaskList, JournalEntry } from '@/lib/types';
import { useState } from 'react';
// import TaskGridBoard from "@/components/taskgrid/TaskGridBoard"; // Replaced with TaskListSection
import TaskListSection from "@/components/tasks/TaskListSection"; // Import new component
import JournalSection from "@/components/journal/JournalSection";
import AppHeader from "@/components/layout/AppHeader";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { Card, CardContent } from "@/components/ui/card";
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

const mockJournalEntries: JournalEntry[] = [
  { id: 'j1', date: '2024-07-27', content: 'Started working on the homepage design.', createdAt: new Date(), updatedAt: new Date(), relatedTaskIds: ['1'] },
  { id: 'j2', date: '2024-07-28', content: 'Completed the project documentation draft.', createdAt: new Date(), updatedAt: new Date(), relatedTaskIds: ['3'] },
];

export default function Home() {
  const [activeView, setActiveView] = useState<'journal' | 'tasks' | 'calendar' | 'search'>('tasks'); // Default to tasks view
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [taskLists, setTaskLists] = useState<TaskList[]>(mockTaskLists);

  // Handlers to update state (to be passed down)
  const handleUpdateTasks = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
    // TODO: Persist changes
  };

  const handleUpdateTaskLists = (updatedTaskLists: TaskList[]) => {
    setTaskLists(updatedTaskLists);
    // TODO: Persist changes
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />

      <main className="flex-1 p-4 md:p-6 space-y-4">
         {/* Placeholder Quote Section - Remove if not needed */}
         <blockquote className="border-l-4 border-muted pl-4 italic text-muted-foreground text-sm my-6">
           One way to get the most out of life is to look upon it as an adventure.
           <footer className="mt-1 block text-xs not-italic text-muted-foreground/80">— William Feather</footer>
         </blockquote>

          {/* Placeholder Week View Section - Remove if not needed */}
         <div className="mb-6">
             <div className="flex justify-between items-center text-xs text-muted-foreground mb-2 px-2">
                <span>W18 &gt;</span> {/* Placeholder Week */}
                <div className="flex space-x-4">
                   <div className="flex flex-col items-center"><span className="font-medium">M</span><span>28</span></div>
                   <div className="flex flex-col items-center"><span className="font-medium">T</span><span>29</span></div>
                   <div className="flex flex-col items-center"><span className="font-medium">W</span><span>30</span></div>
                   <div className="flex flex-col items-center"><span className="font-medium">T</span><span>1</span></div>
                   <div className="flex flex-col items-center text-primary"><span className="font-medium">F</span><span>2</span></div>
                   <div className="flex flex-col items-center"><span className="font-medium">S</span><span>3</span></div>
                   <div className="flex flex-col items-center"><span className="font-medium">S</span><span>4</span></div>
                </div>
             </div>
              <Separator />
         </div>


        {/* Main content area - Render components based on activeView */}
        {activeView === 'journal' && (
             <JournalSection initialEntries={mockJournalEntries} tasks={tasks} />
         )}
         {activeView === 'tasks' && (
             <TaskListSection
                initialTasks={tasks}
                initialTaskLists={taskLists}
                onTasksChange={handleUpdateTasks}
                onTaskListsChange={handleUpdateTaskLists}
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

