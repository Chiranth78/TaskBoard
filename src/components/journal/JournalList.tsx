
"use client";

import type { JournalEntry } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react'; // Import Plus icon
import Image from 'next/image';

interface JournalListProps {
  entries: JournalEntry[];
  onJournalClick: (entry?: JournalEntry) => void; // Pass entry to edit or undefined for new
  onAddJournal: () => void; // Add prop for adding a new journal
}

// Mock journal data for the list view (replace with actual data logic)
const mockJournals = [
    { id: 'default-journal', title: 'My Journal', imageUrl: 'https://picsum.photos/200/150' },
    // Add more journals if needed
];

export default function JournalList({ entries, onJournalClick, onAddJournal }: JournalListProps) {

  // In a real app, you'd filter or fetch specific journal 'books' here.
  // For now, we just display one card representing the main journal.
  const mainJournal = mockJournals[0];

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">Journals</h2>
        {/* Changed button to Plus icon and linked to onAddJournal */}
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary" onClick={onAddJournal}>
          <Plus className="h-5 w-5" />
           <span className="sr-only">Add New Journal</span>
        </Button>
      </div>

      {/* Grid for Journal Cards */}
       {/* TODO: Map through actual journal 'books' if supporting multiple */}
       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {/* Displaying only the mock main journal for now */}
            {mainJournal && (
                <Card
                    className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow bg-card border-border group"
                    onClick={() => onJournalClick()} // Pass no specific entry to indicate creating/editing today's entry in the grid
                    // If you want to edit a specific entry from the list (e.g., by date):
                    // onClick={() => onJournalClick(entries.find(e => e.id === some_logic_to_find_entry))}
                    role="button"
                    tabIndex={0}
                    aria-label={`Open ${mainJournal.title}`}
                >
                    <CardContent className="p-0 aspect-[3/4] relative"> {/* Aspect ratio for book-like shape */}
                    <Image
                        src={mainJournal.imageUrl}
                        alt={mainJournal.title}
                        layout="fill"
                        objectFit="cover"
                        className="group-hover:scale-105 transition-transform duration-300"
                        data-ai-hint="journal cover abstract minimal"
                    />
                    {/* Optional Overlay */}
                    {/* <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div> */}
                    </CardContent>
                    <CardFooter className="p-3 bg-card border-t border-border">
                        <p className="text-sm font-medium text-card-foreground truncate">{mainJournal.title}</p>
                    </CardFooter>
                </Card>
            )}

            {/* Placeholder for adding a new Journal */}
             {/*
             <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow bg-muted border-border flex items-center justify-center aspect-[3/4]">
                 <button className="text-muted-foreground">
                     <PlusCircle className="h-8 w-8" />
                      <span className="sr-only">Add New Journal</span>
                 </button>
             </Card>
             */}

       </div>

        {/* Display message if no journals exist */}
        {mockJournals.length === 0 && (
            <p className="text-muted-foreground text-center mt-4">No journals yet. Create one!</p>
        )}
    </div>
  );
}
