
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

// Structure for the new journal editor grid layout
export interface JournalContentGrid {
    commitment?: string;
    gratitude?: string;
    mustDo?: string;
    improvement?: string;
}

export interface JournalEntry {
  id: string;
  // journalBookId?: string; // Optional: Link entry to a specific JournalBook if needed
  date: Date | string; // Date of the entry
  content?: string; // User's journal text (kept optional for backward compatibility or simple entries)
  contentGrid?: JournalContentGrid; // New structure for grid data
  relatedTaskIds?: string[]; // Link to tasks completed/worked on that day
  createdAt: Date;
  updatedAt: Date;
}

// Interface for Journal "Books"
export interface JournalBook {
    id: string;
    title: string;
    imageUrl: string; // URL or potentially data URI for the cover image
    createdAt?: Date; // Optional: When the book was created
    updatedAt?: Date; // Optional: Last updated timestamp
}


// Used for consistency tracker
export type JournalEntryDate = string; // YYYY-MM-DD format

    