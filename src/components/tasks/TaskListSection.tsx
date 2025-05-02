
"use client";

import type { Task, TaskList } from '@/lib/types';
import { useState, useEffect, useMemo } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, ListChecks, MoreVertical, ArrowUpDown, Trash2 } from 'lucide-react'; // Added Trash2
// Removed TaskListTabs import
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TaskItem from './TaskItem';
import CompletedTasksAccordion from './CompletedTasksAccordion';
import AddEditTaskDialog from '../taskgrid/AddEditTaskDialog';
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator, // Added Separator
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"


interface TaskListSectionProps {
  initialTasks: Task[];
  initialTaskLists: TaskList[];
  selectedListId: string | null; // Receive selected list ID from parent
  onTasksChange: (tasks: Task[]) => void;
  onTaskListsChange: (lists: TaskList[]) => void;
  onSelectListChange: (listId: string | null) => void; // Prop to notify parent about list changes (like deletion)
}

export default function TaskListSection({
  initialTasks,
  initialTaskLists,
  selectedListId, // Use prop
  onTasksChange,
  onTaskListsChange,
  onSelectListChange
}: TaskListSectionProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [taskLists, setTaskLists] = useState<TaskList[]>(initialTaskLists);
  // Removed selectedListId state, using prop instead
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isAddListDialogOpen, setIsAddListDialogOpen] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  const [listToDelete, setListToDelete] = useState<TaskList | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
    // No need to set default selectedListId here, parent handles it
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Depend only on initial lists


   useEffect(() => {
       // Update local state if initial props change
       setTasks(initialTasks);
       setTaskLists(initialTaskLists);
   }, [initialTasks, initialTaskLists]);

   useEffect(() => {
       // Callbacks to notify parent about state changes
       onTasksChange(tasks);
       onTaskListsChange(taskLists);
       // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [tasks, taskLists]);


  const selectedList = useMemo(() => {
    return taskLists.find(list => list.id === selectedListId);
  }, [taskLists, selectedListId]);

  const { completedTasks, incompleteTasks } = useMemo(() => {
    const filteredTasks = tasks.filter(task => task.listId === selectedListId);
    return {
      completedTasks: filteredTasks.filter(task => task.completed).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()), // Sort completed by updated date desc
      incompleteTasks: filteredTasks.filter(task => !task.completed).sort((a,b) => (a.isStarred === b.isStarred)? 0 : a.isStarred? -1 : 1) // Sort incomplete, starred first
    };
  }, [tasks, selectedListId]);


  // handleSelectList removed, selection is done in parent

  const handleAddTask = () => {
    if (!newTaskTitle.trim() || !selectedListId) return;

    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      listId: selectedListId,
      title: newTaskTitle.trim(),
      priority: 'medium', // Default priority
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
    setNewTaskTitle(''); // Clear input field
     toast({ title: "Task Added", description: `"${newTask.title}" added to ${selectedList?.name}.` });
    // TODO: API call to create task
  };

  const handleToggleComplete = (taskId: string) => {
    let taskTitle = '';
    let isComplete = false;
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === taskId) {
           taskTitle = task.title;
           isComplete = !task.completed;
          return { ...task, completed: !task.completed, updatedAt: new Date() };
        }
        return task;
      })
    );
     toast({ title: "Task Updated", description: `"${taskTitle}" marked as ${isComplete ? 'complete' : 'incomplete'}.` });
    // TODO: API call to update task
  };

  const handleToggleStar = (taskId: string) => {
     let taskTitle = '';
     let isStarred = false;
     setTasks(prevTasks =>
        prevTasks.map(task => {
        if (task.id === taskId) {
            taskTitle = task.title;
            isStarred = !task.isStarred;
            return { ...task, isStarred: !task.isStarred, updatedAt: new Date() };
        }
        return task;
        })
    );
     toast({ title: "Task Updated", description: `"${taskTitle}" ${isStarred ? 'starred' : 'unstarred'}.` });
     // TODO: API call to update task
  };

   // --- Edit/Delete Task Handlers ---
   const handleEditTask = (task: Task) => {
       setEditingTask(task);
       setIsEditDialogOpen(true);
   };

   const handleDeleteTask = (taskId: string) => {
       const taskToDelete = tasks.find(t => t.id === taskId);
       if(taskToDelete){
           setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
           toast({ title: "Task Deleted", description: `"${taskToDelete.title}" removed.`, variant: "destructive" });
           // TODO: API call to delete task
       }
   };

   const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt'> | Task) => {
        if ('id' in taskData && taskData.id) {
             // Editing existing task - Ensure listId is included
            const updatedTask = {
                ...tasks.find(t => t.id === taskData.id), // Get original task data
                ...taskData, // Apply changes from form
                listId: taskData.listId || selectedListId!, // Ensure listId is set
                updatedAt: new Date()
            } as Task; // Type assertion

            setTasks(prevTasks => prevTasks.map(t => (t.id === updatedTask.id ? updatedTask : t)));
            toast({ title: "Task Updated", description: `"${updatedTask.title}" saved.` });
             // TODO: API call to update task
        } else {
             console.warn("handleSaveTask called without a task ID. Use handleAddTask for new tasks.");
        }
       setIsEditDialogOpen(false);
       setEditingTask(null);
   };


    // --- Add/Delete List Handlers ---
    // handleAddListClick is now handled by parent via TaskListTabs
    const handleAddListClick = () => {
        setNewListName(''); // Reset name field
        setIsAddListDialogOpen(true);
    };

    const handleSaveNewList = () => {
        if (!newListName.trim()) {
            toast({ title: "Error", description: "List name cannot be empty.", variant: "destructive" });
            return;
        }
        const newList: TaskList = {
            id: `list-${Date.now()}-${Math.random().toString(16).slice(2)}`,
            name: newListName.trim(),
            createdAt: new Date(),
        };
        setTaskLists(prev => [...prev, newList]);
        onSelectListChange(newList.id); // Notify parent to select the newly added list
        setIsAddListDialogOpen(false);
        toast({ title: "List Created", description: `"${newList.name}" added.` });
        // TODO: API call to create list
    };

    const handleDeleteListClick = (list: TaskList) => {
        setListToDelete(list);
        setIsConfirmDeleteDialogOpen(true);
    }

    const confirmDeleteList = () => {
        if (!listToDelete) return;

        const listIdToDelete = listToDelete.id;
        const listName = listToDelete.name;

        // Filter out the list to delete _before_ updating state
        const remainingLists = taskLists.filter(l => l.id !== listIdToDelete);

        // Update the list state (triggers parent update via useEffect)
        setTaskLists(remainingLists);

        // Delete associated tasks (triggers parent update via useEffect)
        setTasks(prev => prev.filter(t => t.listId !== listIdToDelete));

        // If the deleted list was selected, notify parent to select the first available list or null
        if (selectedListId === listIdToDelete) {
           onSelectListChange(remainingLists.length > 0 ? remainingLists[0].id : null);
        }

        toast({ title: "List Deleted", description: `"${listName}" and all its tasks were deleted.`, variant: "destructive" });
        setIsConfirmDeleteDialogOpen(false);
        setListToDelete(null);
        // TODO: API calls to delete list and its tasks
    }


  if (!isMounted) {
    // Skeleton loader for the task list section
    return (
      <div className="space-y-4">
        {/* Removed Skeleton for tabs */}
        <Card>
          <CardHeader className="p-4 border-b border-border">
             <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-1/2" />
                 <Skeleton className="h-8 w-8" />
             </div>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            <Skeleton className="h-10 w-full" /> {/* Add task input */}
             <Skeleton className="h-8 w-full" />
             <Skeleton className="h-8 w-full" />
             <Skeleton className="h-8 w-full" />
             <Skeleton className="h-8 w-3/4 mt-4" /> {/* Completed accordion */}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
       {/* TaskListTabs are now rendered in page.tsx */}

      {/* Main Task Area */}
      {selectedListId && selectedList ? (
        <Card className="border-none shadow-none bg-card">
          <CardHeader className="p-4 border-b border-border">
             <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold">{selectedList.name}</CardTitle>
                 {/* List Options Dropdown */}
                 <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                         <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                             <MoreVertical className="h-4 w-4" />
                         </Button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent align="end">
                         <DropdownMenuItem onClick={() => alert('Rename list functionality coming soon!')}>
                             <ArrowUpDown className="mr-2 h-4 w-4" /> Rename list
                         </DropdownMenuItem>
                         <DropdownMenuSeparator />
                          {/* Use AlertDialogTrigger within DropdownMenuItem for delete confirmation */}
                         <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                                className="text-destructive focus:text-destructive focus:bg-destructive/10"
                                onSelect={(e) => {
                                    e.preventDefault(); // Prevent default closing
                                    handleDeleteListClick(selectedList); // Trigger confirmation dialog
                                }}
                            >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete list
                            </DropdownMenuItem>
                         </AlertDialogTrigger>
                     </DropdownMenuContent>
                 </DropdownMenu>
             </div>
          </CardHeader>
          <CardContent className="p-4 space-y-2">
             {/* Incomplete Tasks */}
            <div className="space-y-1">
                {incompleteTasks.map((task) => (
                    <TaskItem
                    key={task.id}
                    task={task}
                    onToggleComplete={handleToggleComplete}
                    onToggleStar={handleToggleStar}
                     onEdit={handleEditTask} // Pass edit handler
                    onDelete={handleDeleteTask} // Pass delete handler
                    />
                ))}
             </div>

            {/* Input for adding new task */}
            <div className="flex items-center space-x-2 pt-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" disabled> {/* Placeholder icon */}
                <Plus className="h-4 w-4" />
              </Button>
              <Input
                type="text"
                placeholder="Add a task"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                className="h-9 flex-1 bg-transparent border-none focus:ring-0 focus:outline-none placeholder:text-muted-foreground text-sm px-0"
              />
               {/* Hidden submit button for form semantics if needed, or rely on Enter key */}
               <Button onClick={handleAddTask} size="sm" className={!newTaskTitle.trim() ? 'invisible' : 'visible'}>Add</Button>
            </div>


            {/* Completed Tasks Accordion */}
            <CompletedTasksAccordion
                tasks={completedTasks}
                onToggleComplete={handleToggleComplete}
                onToggleStar={handleToggleStar}
                 onEdit={handleEditTask} // Pass edit handler
                onDelete={handleDeleteTask} // Pass delete handler
             />

          </CardContent>
        </Card>
      ) : (
         // Placeholder when no list is selected or no lists exist
        <Card className="border-none shadow-none bg-card">
          <CardContent className="pt-10 flex flex-col items-center justify-center text-center">
            <ListChecks className="h-12 w-12 text-muted-foreground mb-4" />
             <p className="text-muted-foreground">
                 {taskLists.length > 0 ? "Select a list to view tasks" : "No task lists available."}
             </p>
             {/* Button to add list - Trigger dialog managed by parent now */}
             {/* Consider adding a way to trigger the parent's add list dialog here if needed */}
              {/* <Button onClick={handleAddListClick} size="sm" className="mt-4">
                 <Plus className="mr-2 h-4 w-4" /> Create New List
              </Button> */}
          </CardContent>
        </Card>
      )}

       {/* Edit Task Dialog */}
        <AddEditTaskDialog
            isOpen={isEditDialogOpen}
            onClose={() => { setIsEditDialogOpen(false); setEditingTask(null); }}
            onSave={handleSaveTask}
            task={editingTask}
            availableLists={taskLists} // Pass available lists
            currentListId={selectedListId} // Pass current list id
        />

        {/* Add List Dialog (Now triggered by parent, but definition stays here or moves to parent) */}
        {/* If keeping state here, it won't open unless triggered locally */}
        {/* It's better practice to move this dialog logic entirely to the parent (page.tsx) */}
        {/*
        <AlertDialog open={isAddListDialogOpen} onOpenChange={setIsAddListDialogOpen}>
             // ... Content ...
        </AlertDialog>
        */}


         {/* Confirm Delete List Dialog */}
          <AlertDialog open={isConfirmDeleteDialogOpen} onOpenChange={setIsConfirmDeleteDialogOpen}>
             <AlertDialogContent>
                 <AlertDialogHeader>
                 <AlertDialogTitle>Delete List "{listToDelete?.name}"?</AlertDialogTitle>
                 <AlertDialogDescription>
                     This action cannot be undone. This will permanently delete the list and all associated tasks.
                 </AlertDialogDescription>
                 </AlertDialogHeader>
                 <AlertDialogFooter>
                 <AlertDialogCancel onClick={() => setListToDelete(null)}>Cancel</AlertDialogCancel>
                 <AlertDialogAction onClick={confirmDeleteList} className={buttonVariants({ variant: "destructive" })}>Delete</AlertDialogAction>
                 </AlertDialogFooter>
             </AlertDialogContent>
         </AlertDialog>


         {/* Floating Add Button */}
        {selectedListId && (
             <Button
                onClick={() => document.querySelector<HTMLInputElement>('input[placeholder="Add a task"]')?.focus()} // Focus input on click
                size="lg"
                className="fixed bottom-20 right-4 z-30 rounded-full shadow-lg h-14 w-14 p-0"
                aria-label="Add New Task"
             >
                <Plus className="h-6 w-6" />
             </Button>
        )}
    </div>
  );
}
