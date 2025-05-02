import type { Task } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Edit, Trash2, MoreVertical, AlertCircle } from 'lucide-react'; // Added AlertCircle for overdue
import { format, formatDistanceToNow, isToday, isPast, isValid } from 'date-fns'; // Ensure isValid is imported
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

   const getDueDateInfo = () => {
    if (!dueDate) return { text: null, isOverdue: false, isUrgent: false };
    const date = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
    if (!isValid(date)) return { text: null, isOverdue: false, isUrgent: false }; // Check if date is valid

    const now = new Date();
    const isTaskPast = isPast(date) && !isToday(date); // Check if it's strictly past, not today
    const isTaskToday = isToday(date);

    let text = `Due ${format(date, 'MMM d')}`;
    let relativeText = formatDistanceToNow(date, { addSuffix: true });

    if (isTaskToday) text = `Due Today`;
    else if (isTaskPast) text = `Overdue`;
    // else text remains 'Due MMM d'

    const isOverdue = isTaskPast && !completed;
    // Consider today's tasks urgent as well if high priority
    const isUrgent = (isTaskToday || isOverdue) && priority === 'high' && !completed;

    return { text, relativeText: !isTaskToday && !isTaskPast ? `(${relativeText})` : null , isOverdue, isUrgent };
  };


  const { text: dueDateText, relativeText: dueDateRelativeText, isOverdue, isUrgent } = getDueDateInfo();

  return (
    <Card className={cn(
      "flex flex-col justify-between transition-shadow duration-200 ease-in-out hover:shadow-lg bg-card", // Use card background
      completed && "task-completed", // Use custom class for completed style
      isUrgent && "task-urgent" // Use custom class for urgent style
    )}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 p-4"> {/* Adjusted padding */}
        <div className="space-y-1 flex-1 mr-2"> {/* Added flex-1 and margin */}
           <CardTitle className={cn("text-base font-medium leading-tight", completed && "line-through text-muted-foreground/80")}>{title}</CardTitle>
           {description && <CardDescription className={cn("text-xs text-muted-foreground pt-1", completed && "line-through text-muted-foreground/80")}>{description}</CardDescription>}
        </div>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0 text-muted-foreground hover:text-foreground"> {/* Smaller icon button */}
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
      {/* CardContent removed as description is in header */}
      <CardFooter className="flex justify-between items-center p-3 pt-2 border-t border-border/50"> {/* Adjusted padding and border */}
        <div className="flex items-center space-x-2">
            <Checkbox
              id={`complete-${id}`}
              checked={completed}
              onCheckedChange={handleCheckboxChange}
              aria-label={completed ? "Mark task as incomplete" : "Mark task as complete"}
              className="h-5 w-5" // Slightly larger checkbox
            />
             <label
              htmlFor={`complete-${id}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 sr-only" // Hide label visually but keep for accessibility
            >
              {completed ? "Completed" : "Mark Complete"}
            </label>
            {/* Badge remains for priority, but maybe less prominent */}
            <Badge variant={priority === 'high' ? 'destructive' : priority === 'medium' ? 'secondary' : 'outline'} className="capitalize text-xs px-1.5 py-0.5">
                {priority}
            </Badge>

        </div>

         {dueDateText && (
           <span className={cn(
                "text-xs flex items-center gap-1",
                completed ? "text-muted-foreground/80" :
                isOverdue ? "text-destructive font-medium" :
                "text-muted-foreground"
                )}>
                {isOverdue && <AlertCircle className="h-3 w-3 text-destructive" />}
                {dueDateText} <span className="hidden sm:inline">{dueDateRelativeText}</span> {/* Show relative time on larger screens */}
           </span>
         )}

      </CardFooter>
    </Card>
  );
}
