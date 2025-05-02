
export interface TaskList {
  id: string;
  name: string;
  createdAt: Date;
  // Potentially add color or icon in the future
}

export interface Task {
  id: string;
  listId: string;
  title: string;
  description?: string;
  dueDate?: Date | string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  isStarred?: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  category?: string;
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
  date: Date | string; // Date of the entry (can be Date object or YYYY-MM-DD string)
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


// Used for consistency tracker (represents a date with a journal entry)
export type JournalEntryDate = string; // Format: YYYY-MM-DD
