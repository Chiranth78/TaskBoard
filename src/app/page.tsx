"use client";

import { useState } from 'react';
import TaskGridBoard from "@/components/taskgrid/TaskGridBoard";
import JournalSection from "@/components/journal/JournalSection";
// ConsistencyTracker removed as it was in the sidebar footer
// import ConsistencyTracker from "@/components/tracker/ConsistencyTracker";
import AppHeader from "@/components/layout/AppHeader";
import BottomNavigation from "@/components/layout/BottomNavigation"; // Import BottomNavigation
import { Card, CardContent } from "@/components/ui/card"; // For Quote
import { Separator } from '@/components/ui/separator'; // For separators

// Mock data - replace with actual data fetching
const mockTasks = [
  { id: '1', title: 'Design homepage mockup', priority: 'high', completed: false, createdAt: new Date(), gridPosition: { row: 0, col: 0 }, dueDate: new Date(Date.now() + 86400000 * 2) }, // Due in 2 days
  { id: '2', title: 'Develop login feature', priority: 'medium', completed: false, createdAt: new Date(), gridPosition: { row: 0, col: 1 }, dueDate: new Date(Date.now() + 86400000 * 5) }, // Due in 5 days
  { id: '3', title: 'Write project documentation', priority: 'low', completed: true, createdAt: new Date(), gridPosition: { row: 1, col: 0 } },
  { id: '4', title: 'Deploy to staging server', priority: 'high', completed: false, createdAt: new Date(), gridPosition: { row: 1, col: 1 }, dueDate: new Date() }, // Due today
];
const mockJournalEntries = [
  { id: 'j1', date: '2024-07-27', content: 'Started working on the homepage design.', createdAt: new Date(), updatedAt: new Date(), relatedTaskIds: ['1'] },
  { id: 'j2', date: '2024-07-28', content: 'Completed the project documentation draft.', createdAt: new Date(), updatedAt: new Date(), relatedTaskIds: ['3'] },
];
// const mockConsistencyDates = ['2024-07-27', '2024-07-28', '2024-07-25']; // Removed

export default function Home() {
  // State to manage the active view controlled by BottomNavigation
  const [activeView, setActiveView] = useState<'journal' | 'tasks' | 'calendar' | 'search'>('journal');

  // In a real app, state management (useState, useReducer, Zustand, etc.)
  // and data fetching (server components, useEffect, react-query) would be used here.
  // For now, we pass mock data.

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />

      <main className="flex-1 p-4 md:p-6 space-y-4">
         {/* Placeholder Quote Section */}
         <blockquote className="border-l-4 border-muted pl-4 italic text-muted-foreground text-sm my-6">
           One way to get the most out of life is to look upon it as an adventure.
           <footer className="mt-1 block text-xs not-italic text-muted-foreground/80">— William Feather</footer>
         </blockquote>

          {/* Placeholder Week View Section */}
         <div className="mb-6">
             <div className="flex justify-between items-center text-xs text-muted-foreground mb-2 px-2">
                <span>W18 &gt;</span> {/* Placeholder Week */}
                {/* Placeholder Days */}
                <div className="flex space-x-4">
                   <div className="flex flex-col items-center"><span className="font-medium">M</span><span>28</span></div>
                   <div className="flex flex-col items-center"><span className="font-medium">T</span><span>29</span></div>
                   <div className="flex flex-col items-center"><span className="font-medium">W</span><span>30</span></div>
                   <div className="flex flex-col items-center"><span className="font-medium">T</span><span>1</span></div>
                   <div className="flex flex-col items-center text-primary"><span className="font-medium">F</span><span>2</span></div> {/* Highlighted Day */}
                   <div className="flex flex-col items-center"><span className="font-medium">S</span><span>3</span></div>
                   <div className="flex flex-col items-center"><span className="font-medium">S</span><span>4</span></div>
                </div>
             </div>
              <Separator />
         </div>


        {/* Main content area - Render components based on activeView */}
        {activeView === 'journal' && (
             <JournalSection initialEntries={mockJournalEntries} tasks={mockTasks} />
         )}
         {activeView === 'tasks' && (
             <TaskGridBoard initialTasks={mockTasks} />
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
