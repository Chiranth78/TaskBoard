
export interface TaskList {
  id: string;
  name: string;
  createdAt: Date;
  // Potentially add color or icon in the future
}

export interface Task {
  id: string;
  listId: string; // Link to a TaskList
  title: string;
  description?: string;
  dueDate?: Date | string; // Allow string for easier state management/form handling initially
  priority: 'low' | 'medium' | 'high'; // Keep priority for potential sorting/filtering later
  completed: boolean;
  isStarred?: boolean; // For marking important tasks
  createdAt: Date;
  updatedAt: Date; // Added update timestamp
  // gridPosition is no longer needed for list view
  // gridPosition?: { row: number; col: number }; // For grid layout
  category?: string; // Optional category
}

export interface JournalEntry {
  id: string;
  date: Date | string; // Date of the entry
  content: string; // User's journal text
  relatedTaskIds?: string[]; // Link to tasks completed/worked on that day
  createdAt: Date;
  updatedAt: Date;
}

// Used for consistency tracker
export type JournalEntryDate = string; // YYYY-MM-DD format
