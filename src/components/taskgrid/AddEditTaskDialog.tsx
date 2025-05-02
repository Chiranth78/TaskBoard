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
import { Switch } from "@/components/ui/switch";
import { CalendarIcon, Star } from 'lucide-react';
import { format, isValid, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";

interface AddEditTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Omit<Task, 'id' | 'createdAt'> | Task) => void;
  task: Task | null;
  availableLists?: TaskList[];
  currentListId?: string | null;
}

export default function AddEditTaskDialog({
  isOpen,
  onClose,
  onSave,
  task,
  availableLists = [],
  currentListId = null,
}: AddEditTaskDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [listId, setListId] = useState<string | undefined>(undefined);
  const [isStarred, setIsStarred] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      if (task) {
        setTitle(task.title);
        setDescription(task.description || '');
        setDueDate(task.dueDate && isValid(parseISO(task.dueDate as string)) ? parseISO(task.dueDate as string) : undefined);
        setPriority(task.priority);
        setListId(task.listId);
        setIsStarred(task.isStarred || false);
      } else {
        setTitle('');
        setDescription('');
        setDueDate(undefined);
        setPriority('medium');
        setListId(currentListId ?? availableLists[0]?.id);
        setIsStarred(false);
      }
    }
  }, [task, isOpen, currentListId, availableLists]);

  const handleSave = () => {
    if (!title.trim()) {
      toast({
        title: "Validation Error",
        description: "Task title cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    if (!listId) {
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
      dueDate: dueDate ? dueDate.toISOString() : undefined,
      priority,
      listId: listId,
      isStarred: isStarred,
    };

    if (task) {
      onSave({
        ...task,
        ...taskData,
        updatedAt: new Date(),
      });
    } else {
      onSave({
        ...taskData,
        completed: false,
       updatedAt: new Date(),
      } as Omit<Task, 'id' | 'createdAt'>);
      onClose();
    }
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

          {(availableLists.length > 1 || task) && (
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
          )}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dueDate" className="text-right text-muted-foreground">
              Due Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
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

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="starred" className="text-right text-muted-foreground flex items-center gap-1 justify-end">
              <Star className={cn("h-3.5 w-3.5", isStarred ? "text-amber-500 fill-amber-400" : "text-muted-foreground")} />
              Star
            </Label>
            <Switch
              id="starred"
              checked={isStarred}
              onCheckedChange={setIsStarred}
              className="col-span-3 justify-self-start"
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

