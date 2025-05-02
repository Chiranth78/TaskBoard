"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Grid3X3, BookOpen, CalendarCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  { href: "/", label: "Task Grid", icon: Grid3X3 },
  { href: "/journal", label: "Journal", icon: BookOpen },
  // Removed Consistency Tracker from main nav as it's in the footer now
  // { href: "/tracker", label: "Consistency", icon: CalendarCheck },
];

export default function MainNavigation() {
  const pathname = usePathname(); // Use client-side hook

  return (
    <SidebarMenu>
      {navigationItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          {/*
            Using <a> tag for now. In a real app with routing,
            you'd use Next.js <Link> and manage active state properly.
            We'll simulate active state with pathname for now.
          */}
          <SidebarMenuButton
            asChild // Render the child component (<a>) instead of a <button>
            isActive={pathname === item.href}
            className={cn(
              "w-full justify-start",
              pathname === item.href ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
            )}
            // Add tooltip for collapsed state
            tooltip={{ children: item.label, side: 'right', align: 'center' }}
          >
            {/* Using standard <a> for now, replace with <Link> if routing is added */}
            <a href={item.href} className="flex items-center gap-2">
              <item.icon className="h-4 w-4" />
              <span className="truncate">{item.label}</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
