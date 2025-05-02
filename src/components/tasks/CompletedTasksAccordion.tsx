
"use client";

import type { Task } from '@/lib/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import TaskItem from './TaskItem';

interface CompletedTasksAccordionProps {
  tasks: Task[];
  onToggleComplete: (taskId: string) => void;
  onToggleStar: (taskId: string) => void;
   onEdit: (task: Task) => void;
   onDelete: (taskId: string) => void;
}

export default function CompletedTasksAccordion({
  tasks,
  onToggleComplete,
  onToggleStar,
  onEdit,
  onDelete
}: CompletedTasksAccordionProps) {
  if (tasks.length === 0) {
    return null; // Don't render if there are no completed tasks
  }

  return (
    <Accordion type="single" collapsible className="w-full mt-4 border-t border-border pt-2">
      <AccordionItem value="completed-tasks" className="border-b-0">
        <AccordionTrigger className="text-sm text-muted-foreground hover:no-underline py-2 font-medium">
          Completed ({tasks.length})
        </AccordionTrigger>
        <AccordionContent className="pt-2 pb-0">
          <div className="space-y-1">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleComplete={onToggleComplete}
                onToggleStar={onToggleStar}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
