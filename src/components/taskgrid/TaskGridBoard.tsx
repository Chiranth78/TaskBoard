"use client";

import type { Task } from '@/lib/types';
import TaskCard from './TaskCard';
import { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AddEditTaskDialog from './AddEditTaskDialog'; // Import the dialog

interface TaskGridBoardProps {
  initialTasks: Task[];
}

// Basic grid configuration
const GRID_COLS = 4; // Example: 4 columns

export default function TaskGridBoard({ initialTasks }: TaskGridBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isMounted, setIsMounted] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);


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
    if ('id' in taskData) {
      // Editing existing task
      setTasks(tasks.map(t => t.id === taskData.id ? { ...t, ...taskData } : t));
      // TODO: API call to update task
    } else {
      // Adding new task
      const newTask: Task = {
        ...taskData,
        id: `task-${Date.now()}-${Math.random().toString(16).slice(2)}`, // Temporary unique ID
        createdAt: new Date(),
        completed: false, // Default completed state
        gridPosition: { row: tasks.length % 5, col: tasks.length % GRID_COLS} // Basic positioning
      };
      setTasks([...tasks, newTask]);
       // TODO: API call to create task
    }
    setIsDialogOpen(false); // Close dialog after save
  };

  // Placeholder for delete task functionality
   const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
    // TODO: API call to delete task
    console.log(`Task ${taskId} deleted (locally)`);
  };

  // Placeholder for toggling task completion
  const handleToggleComplete = (taskId: string) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
     // TODO: API call to update task completion status
  };


  if (!isMounted) {
    // Render skeleton or loading state while waiting for client-side mount
    // to avoid potential hydration issues with drag-and-drop libraries later.
    return (
       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
         {[...Array(8)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-lg animate-pulse"></div>
         ))}
       </div>
    );
  }

  // TODO: Implement actual grid layout and drag-and-drop later.
  // For now, just map tasks to cards in a simple grid.
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-foreground">Task Grid</h2>
          <Button onClick={handleAddTaskClick} size="sm">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Task
          </Button>
      </div>
      <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-${GRID_COLS} gap-4`}>
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
          <p className={`col-span-full text-center text-muted-foreground`}>No tasks yet. Add one!</p>
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
