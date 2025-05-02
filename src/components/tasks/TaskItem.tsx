
"use client";

import type { Task } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox";
import { Star, Trash2, Edit } from 'lucide-react'; // Removed MoreVertical, added Edit/Trash
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onToggleStar: (taskId: string) => void;
  onEdit: (task: Task) => void; // Added edit handler
  onDelete: (taskId: string) => void; // Added delete handler
}

export default function TaskItem({ task, onToggleComplete, onToggleStar, onEdit, onDelete }: TaskItemProps) {
  const { id, title, completed, isStarred } = task;

  const handleCheckboxChange = (checked: boolean | "indeterminate") => {
    onToggleComplete(id);
  };

  const handleStarClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering row click or checkbox
    onToggleStar(id);
  };

  const handleEditClick = (e: React.MouseEvent) => {
     e.stopPropagation();
     onEdit(task);
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
     e.stopPropagation();
     onDelete(id);
  }

  return (
    <div
      className={cn(
        "flex items-center justify-between p-3 hover:bg-muted/50 rounded-md group", // Added group for hover effects
        completed && "opacity-60"
      )}
      role="button" // Indicate it's clickable (for potential detail view later)
      tabIndex={0} // Make it focusable
      // onClick={() => console.log("Task clicked:", id)} // Placeholder for opening details
    >
      <div className="flex items-center flex-1 space-x-3 mr-2">
         {/* Custom Circle Checkbox */}
         <Checkbox
            id={`complete-${id}`}
            checked={completed}
            onCheckedChange={handleCheckboxChange}
            aria-label={completed ? "Mark task as incomplete" : "Mark task as complete"}
             // Apply rounded-full and custom styling for circle
             className={cn(
                "h-5 w-5 rounded-full border-2 transition-colors",
                 completed
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-muted-foreground/50 hover:border-primary",
                 "[&[data-state=checked]>svg]:text-primary-foreground" // Ensure checkmark color contrasts with bg
            )}

         />
        <label
          htmlFor={`complete-${id}`}
          className={cn(
            "text-sm font-medium cursor-pointer",
            completed && "line-through text-muted-foreground"
          )}
        >
          {title}
        </label>
      </div>
      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
         {/* Edit Button */}
          <Button
             variant="ghost"
             size="icon"
             className="h-7 w-7 text-muted-foreground hover:text-foreground"
             onClick={handleEditClick}
             aria-label="Edit task"
          >
             <Edit className="h-4 w-4" />
          </Button>
           {/* Delete Button */}
          <Button
             variant="ghost"
             size="icon"
             className="h-7 w-7 text-destructive/80 hover:text-destructive hover:bg-destructive/10"
             onClick={handleDeleteClick}
             aria-label="Delete task"
          >
             <Trash2 className="h-4 w-4" />
          </Button>
         {/* Star Button */}
          <Button
             variant="ghost"
             size="icon"
             className="h-7 w-7 text-muted-foreground hover:text-amber-500" // Amber for star
             onClick={handleStarClick}
             aria-label={isStarred ? "Unstar task" : "Star task"}
          >
             <Star className={cn("h-4 w-4", isStarred ? "fill-amber-400 text-amber-500" : "text-muted-foreground")} />
          </Button>
      </div>
    </div>
  );
}
