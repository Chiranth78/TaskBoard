export interface TaskList {
  id: string;
  name: string;
  createdAt: Date | string; // Ensures consistency across backend & frontend
}

export interface Task {
  id: string;
  listId: string; // Link to a TaskList
  title: string;
  description?: string;
  dueDate?: Date | string; // Accepts both for flexibility
  priority: 'low' | 'medium' | 'high'; // Priority filtering
  completed: boolean;
  isStarred?: boolean; // Star important tasks
  createdAt: Date | string; // For SSR/JSON compatibility
  updatedAt: Date | string; // Same here
  category?: string;
}

// Grid layout structure for journal
export interface JournalContentGrid {
  commitment?: string;
  gratitude?: string;
  mustDo?: string;
  improvement?: string;
}

export interface JournalEntry {
  id: string;
  date: Date | string; // Entry date (can be stringified for storage)
  content?: string; // Optional rich-text
  contentGrid?: JournalContentGrid; // Grid fields
  relatedTaskIds?: string[]; // Tasks completed on this day
  createdAt: Date | string; // Match with frontend/backend usage
  updatedAt: Date | string;
}

// Journal “book” structure
export interface JournalBook {
  id: string;
  title: string;
  imageUrl: string; // Could be hosted or base64
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

// Used to track days with entries (calendar view, etc.)
export type JournalEntryDate = string; // Format: YYYY-MM-DD

