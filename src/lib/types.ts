export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date | string; // Allow string for easier state management/form handling initially
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  createdAt: Date;
  updatedAt: Date; // Added update timestamp
  gridPosition?: { row: number; col: number }; // For grid layout
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
