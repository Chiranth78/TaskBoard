import type { Task } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Edit, Trash2, MoreVertical } from 'lucide-react';
import { format, formatDistanceToNow, isToday, isPast } from 'date-fns';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleComplete: (taskId: string) => void;
}

export default function TaskCard({ task, onEdit, onDelete, onToggleComplete }: TaskCardProps) {
  const { id, title, description, dueDate, priority, completed } = task;

  const handleCheckboxChange = () => {
    onToggleComplete(id);
  };

  const getDueDateText = () => {
    if (!dueDate) return null;
    const date = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
    if (Number.isNaN(date.getTime())) return null; // Invalid date check

    const formattedDate = format(date, 'MMM d');
    if (isToday(date)) return `Today, ${formattedDate}`;
    if (isPast(date) && !completed) return `Overdue, ${formattedDate}`;
    return `Due ${formattedDate} (${formatDistanceToNow(date, { addSuffix: true })})`;
  };

  const dueDateText = getDueDateText();
  const isOverdue = dueDate && isPast(new Date(dueDate)) && !completed;

  return (
    <Card className={cn(
      "flex flex-col justify-between transition-shadow duration-200 ease-in-out hover:shadow-md",
      completed && "task-completed opacity-70", // Use custom class for completed style
      priority === 'high' && !completed && "task-urgent" // Use custom class for urgent style
    )}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
           <CardTitle className={cn("text-lg font-medium", completed && "line-through text-muted-foreground")}>{title}</CardTitle>
           {description && <CardDescription className={cn("text-sm", completed && "line-through text-muted-foreground")}>{description}</CardDescription>}
        </div>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Task Options</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(task)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(id)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="pb-4 pt-0">
        {/* Add more details like category or subtasks here if needed */}
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-2 border-t">
        <div className="flex items-center space-x-2">
            <Checkbox
              id={`complete-${id}`}
              checked={completed}
              onCheckedChange={handleCheckboxChange}
              aria-label={completed ? "Mark task as incomplete" : "Mark task as complete"}
            />
             <label
              htmlFor={`complete-${id}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 sr-only" // Hide label visually but keep for accessibility
            >
              {completed ? "Completed" : "Mark Complete"}
            </label>
           <Badge variant={priority === 'high' ? 'destructive' : priority === 'medium' ? 'secondary' : 'outline'} className="capitalize">
            {priority}
            </Badge>
        </div>

         {dueDateText && (
           <span className={cn("text-xs", completed ? "text-muted-foreground" : isOverdue ? "text-destructive font-medium" : "text-muted-foreground")}>
            {dueDateText}
           </span>
         )}

      </CardFooter>
    </Card>
  );
}
