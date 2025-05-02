"use client";

import { useState, useEffect } from 'react';
import type { Task } from '@/lib/types';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose, // Import DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from 'lucide-react';
import { format, isValid } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast"; // Import useToast

interface AddEditTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'completed' | 'gridPosition'> | Task) => void; // Adjusted type
  task: Task | null; // Pass the task for editing, null for adding
}

export default function AddEditTaskDialog({ isOpen, onClose, onSave, task }: AddEditTaskDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const { toast } = useToast(); // Initialize toast

  useEffect(() => {
    if (isOpen) { // Reset form only when dialog opens
        if (task) {
          // Populate form if editing a task
          setTitle(task.title);
          setDescription(task.description || '');
          setDueDate(task.dueDate ? new Date(task.dueDate) : undefined);
          setPriority(task.priority);
        } else {
          // Reset form if adding a new task
          setTitle('');
          setDescription('');
          setDueDate(undefined);
          setPriority('medium');
        }
    }
  }, [task, isOpen]); // Re-run effect when task or isOpen changes

  const handleSave = () => {
    if (!title.trim()) {
      // Basic validation: Title is required
       toast({
         title: "Validation Error",
         description: "Task title cannot be empty.",
         variant: "destructive",
       });
      return;
    }

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate ? dueDate : undefined, // Pass Date object or undefined
      priority,
    };


    if (task) {
      // If editing, spread the existing task and override with new data
       onSave({
          ...task, // Spread existing task properties (id, createdAt, completed, etc.)
          ...taskData, // Override with new data
          dueDate: taskData.dueDate?.toISOString(), // Ensure dueDate is ISO string if exists
          updatedAt: new Date(), // Add/update updatedAt timestamp
       });
    } else {
      // If adding, just send the new data
      // The parent component (TaskGridBoard) will add id, createdAt, completed, etc.
       onSave({
           ...taskData,
           dueDate: taskData.dueDate?.toISOString(), // Ensure dueDate is ISO string if exists
        } as Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'completed' | 'gridPosition'>); // Type assertion needed here
    }
    onClose(); // Close the dialog after saving
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* Apply dark theme styles to DialogContent */}
      <DialogContent className="sm:max-w-[425px] bg-card border-border text-card-foreground">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Add New Task'}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {task ? 'Update the details of your task.' : 'Fill in the details for your new task.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right text-muted-foreground">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3 bg-input border-border focus:ring-primary" // Dark theme input style
              required
              placeholder="E.g., Finish project report"
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right pt-2 text-muted-foreground">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3 bg-input border-border focus:ring-primary" // Dark theme textarea style
              rows={3}
               placeholder="(Optional) Add more details..."
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dueDate" className="text-right text-muted-foreground">
              Due Date
            </Label>
             <Popover>
                <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                    "w-full justify-start text-left font-normal col-span-3 bg-input border-border hover:bg-input/80", // Dark theme button style
                    !dueDate && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                </Button>
                </PopoverTrigger>
                 {/* Apply dark theme styles to PopoverContent */}
                <PopoverContent className="w-auto p-0 bg-popover border-border text-popover-foreground">
                 {/* Calendar itself adapts via CSS variables */}
                <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                />
                </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priority" className="text-right text-muted-foreground">
              Priority
            </Label>
             {/* Select component adapts via CSS variables, ensure trigger/content have dark styles */}
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
        </div>
        <DialogFooter>
           <DialogClose asChild>
                <Button type="button" variant="outline" className="border-border hover:bg-muted"> {/* Dark theme outline button */}
                Cancel
                </Button>
           </DialogClose>
          <Button type="button" onClick={handleSave}>Save Task</Button> {/* Primary button uses theme colors */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
