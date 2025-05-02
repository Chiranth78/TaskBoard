
"use client";

import type { TaskList } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'; // Import ScrollArea

interface TaskListTabsProps {
  lists: TaskList[];
  selectedListId: string | null;
  onSelectList: (listId: string) => void;
  onAddList: () => void;
}

export default function TaskListTabs({
  lists,
  selectedListId,
  onSelectList,
  onAddList,
}: TaskListTabsProps) {
  // Ensure selectedListId is valid or default to the first list if available
  const currentListId = lists.find(list => list.id === selectedListId)
    ? selectedListId
    : lists[0]?.id ?? ''; // Fallback to empty string if no lists

  return (
     // Removed border-b, pb-2, mb-4. Padding/margin handled by parent container (page.tsx)
     <div className="flex items-center space-x-2">
        <ScrollArea className="w-full whitespace-nowrap">
            <Tabs value={currentListId} onValueChange={onSelectList} className="w-max">
                {/* Reduced vertical padding in TabsList for tighter fit */}
                <TabsList className="bg-transparent p-0 h-auto gap-1">
                {lists.map((list) => (
                    <TabsTrigger
                    key={list.id}
                    value={list.id}
                    // Adjusted padding and text size for tabs
                    className="text-sm px-3 py-1.5 rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:text-muted-foreground hover:text-foreground h-auto transition-colors duration-150"
                    >
                    {list.name}
                    </TabsTrigger>
                ))}
                </TabsList>
            </Tabs>
             <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <Button variant="ghost" size="sm" onClick={onAddList} className="ml-auto flex-shrink-0 text-muted-foreground hover:text-foreground">
            <Plus className="h-4 w-4 mr-1" />
            New list
        </Button>
     </div>
  );
}
