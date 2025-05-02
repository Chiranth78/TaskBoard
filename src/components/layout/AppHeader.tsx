"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

export default function AppHeader() {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      <SidebarTrigger className="md:hidden" /> {/* Show trigger only on mobile */}
      <div className="flex-1">
        {/* Placeholder for potential search or title */}
        <h2 className="text-xl font-medium text-foreground">Dashboard</h2>
      </div>
      <Button size="sm">
        <PlusCircle className="mr-2 h-4 w-4" />
        New Task
      </Button>
      {/* Add other header actions here if needed, e.g., User Profile Dropdown */}
    </header>
  );
}
