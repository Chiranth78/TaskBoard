"use client";

import { Button } from "@/components/ui/button";
import { BookOpen, ClipboardList, Calendar, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavigationProps {
  activeView: 'journal' | 'tasks' | 'calendar' | 'search';
  setActiveView: (view: 'journal' | 'tasks' | 'calendar' | 'search') => void;
}

export default function BottomNavigation({ activeView, setActiveView }: BottomNavigationProps) {
  const navItems = [
    { id: 'journal', label: 'Journals', icon: BookOpen },
    { id: 'tasks', label: 'Tasks', icon: ClipboardList }, // Assuming list icon represents tasks
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'search', label: 'Search', icon: Search },
  ] as const; // Use 'as const' for stricter typing of 'id'

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-md items-center justify-around px-4">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            className={cn(
              "flex h-full flex-col items-center justify-center gap-1 rounded-none px-2 text-xs font-medium text-muted-foreground transition-colors duration-150",
              activeView === item.id ? "text-primary border-t-2 border-primary" : "hover:text-foreground"
            )}
            onClick={() => setActiveView(item.id)}
            aria-label={item.label}
          >
            <item.icon className={cn("h-5 w-5", activeView === item.id ? "text-primary" : "")} />
            <span className={cn(activeView === item.id ? "text-primary" : "")}>{item.label}</span>
          </Button>
        ))}
      </div>
    </nav>
  );
}
