
"use client";

import type { Task, TaskList } from '@/lib/types';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch"; // Import Switch for isStarred
import { CalendarIcon, Star } from 'lucide-react'; // Keep CalendarIcon, add Star
import { format, isValid, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";

interface AddEditTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Omit<Task, 'id' | 'createdAt'> | Task) => void;
  task: Task | null; // Pass the task for editing, null for adding
  availableLists?: TaskList[]; // Optional: Pass available lists for selection/moving
  currentListId?: string | null; // Optional: Pass current list ID for default selection
}

export default function AddEditTaskDialog({
  isOpen,
  onClose,
  onSave,
  task,
  availableLists = [], // Default to empty array
  currentListId = null, // Default to null
}: AddEditTaskDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [listId, setListId] = useState<string | undefined>(undefined); // State for selected list ID
  const [isStarred, setIsStarred] = useState(false); // State for star status
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) { // Reset form only when dialog opens
        if (task) {
          // Populate form if editing a task
          setTitle(task.title);
          setDescription(task.description || '');
          // Ensure dueDate is a Date object if it exists and is valid
          setDueDate(task.dueDate && isValid(parseISO(task.dueDate as string)) ? parseISO(task.dueDate as string) : undefined);
          setPriority(task.priority);
          setListId(task.listId); // Set initial list ID
          setIsStarred(task.isStarred || false); // Set initial star status
        } else {
          // Reset form if adding a new task
          setTitle('');
          setDescription('');
          setDueDate(undefined);
          setPriority('medium');
          // Default to current list if adding, or first list if available
          setListId(currentListId ?? availableLists[0]?.id);
          setIsStarred(false);
        }
    }
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task, isOpen, currentListId, availableLists]); // Re-run effect when relevant props change

  const handleSave = () => {
    if (!title.trim()) {
       toast({
         title: "Validation Error",
         description: "Task title cannot be empty.",
         variant: "destructive",
       });
      return;
    }
     if (!listId) { // Check if a list is selected
        toast({
          title: "Validation Error",
          description: "Please select a task list.",
          variant: "destructive",
        });
        return;
      }


    const taskData = {
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate ? dueDate.toISOString() : undefined, // Convert to ISO string or undefined
      priority,
      listId: listId, // Include selected list ID
      isStarred: isStarred, // Include star status
    };


    if (task) {
      // If editing, spread the existing task and override with new data
       onSave({
          ...task, // Spread existing task properties (id, createdAt, completed, etc.)
          ...taskData, // Override with new data
          updatedAt: new Date(), // Add/update updatedAt timestamp
       });
    } else {
      // If adding, just send the new data
      // The parent component will add id, createdAt, completed, etc.
      onSave({
           ...taskData,
           // Ensure dueDate is ISO string or undefined already handled above
        } as Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'completed'>); // Adjust type assertion
    }
    onClose(); // Close the dialog after saving
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border text-card-foreground">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Add New Task'}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {task ? 'Update the details of your task.' : 'Fill in the details for your new task.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Title Input */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right text-muted-foreground">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3 bg-input border-border focus:ring-primary"
              required
              placeholder="E.g., Finish project report"
            />
          </div>

           {/* Description Textarea */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right pt-2 text-muted-foreground">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3 bg-input border-border focus:ring-primary"
              rows={3}
               placeholder="(Optional) Add more details..."
            />
          </div>

           {/* List Selection (Show only if multiple lists available or if editing) */}
           {availableLists.length > 1 || task ? (
             <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="list" className="text-right text-muted-foreground">
                 List
                </Label>
                <Select onValueChange={(value: string) => setListId(value)} value={listId}>
                 <SelectTrigger className="col-span-3 bg-input border-border focus:ring-primary">
                    <SelectValue placeholder="Select a list" />
                 </SelectTrigger>
                 <SelectContent className="bg-popover border-border text-popover-foreground">
                    {availableLists.map((list) => (
                    <SelectItem key={list.id} value={list.id}>{list.name}</SelectItem>
                    ))}
                 </SelectContent>
                </Select>
             </div>
           ) : null /* Hide list selection if only one list exists and adding new task */}

           {/* Due Date Picker */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dueDate" className="text-right text-muted-foreground">
              Due Date
            </Label>
             <Popover>
                <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                    "w-full justify-start text-left font-normal col-span-3 bg-input border-border hover:bg-input/80",
                    !dueDate && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-popover border-border text-popover-foreground">
                <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                />
                </PopoverContent>
            </Popover>
          </div>

           {/* Priority Selection */}
           {/* Priority might be less relevant in simple list view, consider removing or hiding behind 'details' */}
           {/*
           <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="priority" className="text-right text-muted-foreground">
                 Priority
                </Label>
                <Select onValueChange={(value: 'low' | 'medium' | 'high') => setPriority(value)} value={priority}>
                 <SelectTrigger className="col-span-3 bg-input border-border focus:ring-primary">
                    <SelectValue placeholder="Select priority" />
                 </SelectTrigger>
                 <SelectContent className="bg-popover border-border text-popover-foreground">
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                 </SelectContent>
                </Select>
           </div>
            */}

            {/* Starred Switch */}
             <div className="grid grid-cols-4 items-center gap-4">
                 <Label htmlFor="starred" className="text-right text-muted-foreground flex items-center gap-1 justify-end">
                    <Star className={cn("h-3.5 w-3.5", isStarred ? "text-amber-500 fill-amber-400" : "text-muted-foreground")} />
                     Star
                 </Label>
                 <Switch
                    id="starred"
                    checked={isStarred}
                    onCheckedChange={setIsStarred}
                    className="col-span-3 justify-self-start" // Align switch to the left
                 />
             </div>

        </div>
        <DialogFooter>
           <DialogClose asChild>
                <Button type="button" variant="outline" className="border-border hover:bg-muted">
                Cancel
                </Button>
           </DialogClose>
          <Button type="button" onClick={handleSave}>Save Task</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
