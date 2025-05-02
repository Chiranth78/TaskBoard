"use client";

import type { Task } from '@/lib/types';
import TaskCard from './TaskCard';
import { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AddEditTaskDialog from './AddEditTaskDialog'; // Import the dialog
import { useToast } from "@/hooks/use-toast"; // Import useToast

interface TaskGridBoardProps {
  initialTasks: Task[];
}

// Basic grid configuration
const GRID_COLS = 2; // Adjusted for potentially smaller mobile views first

export default function TaskGridBoard({ initialTasks }: TaskGridBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isMounted, setIsMounted] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { toast } = useToast(); // Initialize toast


  useEffect(() => {
    setIsMounted(true);
    // TODO: Fetch tasks from backend/storage if not passed via props
    // For now, we use initialTasks directly
  }, []);

   // Handler to open the dialog for adding a new task
  const handleAddTaskClick = () => {
    setEditingTask(null); // Ensure we are adding, not editing
    setIsDialogOpen(true);
  };

  // Handler to open the dialog for editing an existing task
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };


  // Handler for saving/updating a task (passed to the dialog)
  const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt'> | Task) => {
    let toastMessage = "";
    if ('id' in taskData) {
      // Editing existing task
      setTasks(tasks.map(t => t.id === taskData.id ? { ...t, ...taskData, updatedAt: new Date() } : t)); // Add updatedAt
      toastMessage = `Task "${taskData.title}" updated.`;
      // TODO: API call to update task
    } else {
      // Adding new task
      const newTask: Task = {
        ...taskData,
        id: `task-${Date.now()}-${Math.random().toString(16).slice(2)}`, // Temporary unique ID
        createdAt: new Date(),
        updatedAt: new Date(), // Add updatedAt
        completed: false, // Default completed state
        gridPosition: { row: Math.floor(tasks.length / GRID_COLS), col: tasks.length % GRID_COLS} // Basic positioning
      };
      setTasks([...tasks, newTask]);
      toastMessage = `Task "${newTask.title}" added.`;
       // TODO: API call to create task
    }
    setIsDialogOpen(false); // Close dialog after save
    toast({ title: "Success", description: toastMessage }); // Show toast
  };

  // Handler for deleting a task
   const handleDeleteTask = (taskId: string) => {
     const taskToDelete = tasks.find(t => t.id === taskId);
     if (taskToDelete) {
        setTasks(tasks.filter(t => t.id !== taskId));
        toast({ title: "Task Deleted", description: `Task "${taskToDelete.title}" removed.`, variant: "destructive" });
        // TODO: API call to delete task
        console.log(`Task ${taskId} deleted (locally)`);
     }
  };

  // Handler for toggling task completion
  const handleToggleComplete = (taskId: string) => {
    let completedStatus = false;
    setTasks(tasks.map(t => {
        if (t.id === taskId) {
            completedStatus = !t.completed;
            return { ...t, completed: completedStatus, updatedAt: new Date() }; // Add updatedAt
        }
        return t;
    }));
     toast({ title: "Task Status Updated", description: `Task marked as ${completedStatus ? 'complete' : 'incomplete'}.`});
     // TODO: API call to update task completion status
  };


  if (!isMounted) {
    // Render skeleton or loading state while waiting for client-side mount
    return (
       <div className={`grid grid-cols-1 sm:grid-cols-${GRID_COLS} gap-4`}>
         {[...Array(4)].map((_, i) => ( // Reduced skeleton count
            <div key={i} className="h-36 bg-card rounded-lg animate-pulse"></div>
         ))}
       </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header removed - Add Task button can be placed elsewhere if needed, or rely on global add button */}
      {/*
      <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-foreground">Task Grid</h2>
          <Button onClick={handleAddTaskClick} size="sm">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Task
          </Button>
      </div>
       */}

       {/* Add Task floating button (optional) */}
        <Button
           onClick={handleAddTaskClick}
           size="lg" // Larger button
           className="fixed bottom-20 right-4 z-30 rounded-full shadow-lg h-14 w-14 p-0" // Position bottom right, above nav
           aria-label="Add New Task"
         >
           <PlusCircle className="h-6 w-6" />
         </Button>


      <div className={`grid grid-cols-1 sm:grid-cols-${GRID_COLS} gap-4`}>
        {tasks.map((task) => (
          // Wrap TaskCard with Draggable element when implementing DND
          <TaskCard
            key={task.id}
            task={task}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onToggleComplete={handleToggleComplete}
          />
        ))}
        {tasks.length === 0 && (
           <Card className={`col-span-full bg-card border-none shadow-none`}>
            <CardContent className="pt-6">
                <p className={`text-center text-muted-foreground`}>No tasks yet. Tap the '+' button to add one!</p>
            </CardContent>
           </Card>
        )}
      </div>

       <AddEditTaskDialog
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            onSave={handleSaveTask}
            task={editingTask} // Pass the task being edited, or null if adding
        />
    </div>
  );
}
