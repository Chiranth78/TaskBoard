
"use client";

import type { JournalEntry, JournalBook } from '@/lib/types'; // Import JournalBook
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Plus, MoreVertical, Edit, Image as ImageIcon } from 'lucide-react'; // Import icons
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface JournalListProps {
  journalBooks: JournalBook[]; // Use JournalBook type
  onJournalClick: (journalBookId: string, entry?: JournalEntry) => void; // Pass journalBookId
  onAddJournal: () => void;
  onEditTitle: (journalBook: JournalBook) => void; // Handler to edit title
  onChangeImage: (journalBook: JournalBook) => void; // Handler to change image
}

export default function JournalList({
    journalBooks,
    onJournalClick,
    onAddJournal,
    onEditTitle,
    onChangeImage
}: JournalListProps) {

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">Journals</h2>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary" onClick={onAddJournal}>
          <Plus className="h-5 w-5" />
           <span className="sr-only">Add New Journal</span>
        </Button>
      </div>

      {/* Grid for Journal Cards */}
       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {journalBooks.map((book) => (
                <Card
                    key={book.id}
                    className="overflow-hidden group relative border-border bg-card" // Added relative positioning for dropdown
                    role="button"
                    tabIndex={0}
                    aria-label={`Open ${book.title}`}
                >
                    {/* Journal Options Dropdown */}
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-1 right-1 z-10 h-7 w-7 text-white/70 bg-black/30 hover:bg-black/50 hover:text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => e.stopPropagation()} // Prevent card click
                            >
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">Journal Options</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                            <DropdownMenuItem onClick={() => onEditTitle(book)}>
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Edit Title</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onChangeImage(book)}>
                                <ImageIcon className="mr-2 h-4 w-4" />
                                <span>Change Cover</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                     {/* Image and Title */}
                    <div onClick={() => onJournalClick(book.id)} className="cursor-pointer"> {/* Wrap image/footer in clickable div */}
                        <CardContent className="p-0 aspect-[3/4] relative">
                        <Image
                            src={book.imageUrl || 'https://picsum.photos/200/150'} // Fallback image
                            alt={book.title}
                            layout="fill"
                            objectFit="cover"
                            className="group-hover:scale-105 transition-transform duration-300"
                            data-ai-hint="journal cover abstract minimal"
                        />
                        </CardContent>
                        <CardFooter className="p-3 bg-card border-t border-border">
                            <p className="text-sm font-medium text-card-foreground truncate">{book.title}</p>
                        </CardFooter>
                    </div>
                </Card>
            ))}

       </div>

        {/* Display message if no journals exist */}
        {journalBooks.length === 0 && (
            <div className="text-center mt-8 text-muted-foreground flex flex-col items-center">
                 <p className="mb-4">No journals yet. Create one to start recording your thoughts.</p>
                 <Button onClick={onAddJournal} size="sm">
                     <Plus className="mr-2 h-4 w-4" /> Create Journal
                 </Button>
            </div>
        )}
    </div>
  );
}

    