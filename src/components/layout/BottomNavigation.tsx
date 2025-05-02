
"use client";

import { Button } from "@/components/ui/button";
// Updated Icons: BookOpen, Menu (for tasks list), CalendarDays, Search
import { BookOpen, Menu, CalendarDays, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavigationProps {
  activeView: 'journal' | 'tasks' | 'calendar' | 'search';
  setActiveView: (view: 'journal' | 'tasks' | 'calendar' | 'search') => void;
}

export default function BottomNavigation({ activeView, setActiveView }: BottomNavigationProps) {
  const navItems = [
    { id: 'journal', label: 'Journals', icon: BookOpen },
    { id: 'tasks', label: 'Tasks', icon: Menu }, // Changed icon to Menu
    { id: 'calendar', label: 'Calendar', icon: CalendarDays }, // Changed icon to CalendarDays
    { id: 'search', label: 'Search', icon: Search },
  ] as const; // Use 'as const' for stricter typing of 'id'

  return (
    // Adjusted background for slightly more transparency if needed, or keep solid bg-background
    <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-border bg-background/98 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-md items-center justify-around px-4">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            className={cn(
              // Adjusted padding, ensure height fills container, remove explicit border-t
              "flex h-full flex-col items-center justify-center gap-1 rounded-none px-2 text-xs font-medium text-muted-foreground transition-colors duration-150 flex-1", // Added flex-1 for equal spacing
              activeView === item.id ? "text-primary" : "hover:text-foreground"
            )}
            onClick={() => setActiveView(item.id)}
            aria-label={item.label}
            // Add the active indicator line at the bottom
            style={{
               boxShadow: activeView === item.id ? 'inset 0 -2px 0 0 hsl(var(--primary))' : 'none'
             }}
          >
             {/* Icon size adjusted slightly */}
            <item.icon className={cn("h-[1.125rem] w-[1.125rem] mb-0.5", activeView === item.id ? "text-primary" : "")} />
            <span className={cn(activeView === item.id ? "text-primary" : "")}>{item.label}</span>
          </Button>
        ))}
      </div>
    </nav>
  );
}
