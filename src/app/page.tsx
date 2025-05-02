import { SidebarProvider, Sidebar, SidebarTrigger, SidebarContent, SidebarHeader, SidebarFooter, SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { CalendarCheck, Grid3X3, BookOpen } from "lucide-react";
import TaskGridBoard from "@/components/taskgrid/TaskGridBoard";
import JournalSection from "@/components/journal/JournalSection";
import ConsistencyTracker from "@/components/tracker/ConsistencyTracker";
import MainNavigation from "@/components/layout/MainNavigation";
import AppHeader from "@/components/layout/AppHeader";

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
const mockConsistencyDates = ['2024-07-27', '2024-07-28', '2024-07-25'];

export default function Home() {
  // In a real app, state management (useState, useReducer, Zustand, etc.)
  // and data fetching (server components, useEffect, react-query) would be used here.
  // For now, we pass mock data.

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
          <h1 className="text-2xl font-semibold text-foreground">TaskGrid</h1>
        </SidebarHeader>
        <SidebarContent className="p-2">
          {/* Navigation will be added here */}
          <MainNavigation />
        </SidebarContent>
        <SidebarFooter className="p-4">
          {/* Footer content if needed */}
           <ConsistencyTracker entryDates={mockConsistencyDates} />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {/* Main content area - Render components based on navigation state */}
          {/* For simplicity, showing TaskGridBoard by default */}
          <TaskGridBoard initialTasks={mockTasks} />
          {/*
          <JournalSection initialEntries={mockJournalEntries} tasks={mockTasks} />
           */}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
