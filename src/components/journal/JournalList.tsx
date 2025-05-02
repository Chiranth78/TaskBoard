
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';

interface JournalListItem {
    id: string;
    name: string;
    imageUrl: string;
    dataAiHint?: string; // Add AI hint for images
}

interface JournalListProps {
    journals: JournalListItem[];
    onViewJournal: (journalId: string) => void; // Callback when a journal is clicked
}

export default function JournalList({ journals, onViewJournal }: JournalListProps) {
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-foreground">Journals</h3>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                    <MoreHorizontal className="h-5 w-5" />
                    <span className="sr-only">Journal Options</span>
                </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {journals.map((journal) => (
                    <Card
                        key={journal.id}
                        className="overflow-hidden cursor-pointer group hover:shadow-md transition-shadow bg-card border-border"
                        onClick={() => onViewJournal(journal.id)} // Call handler on click
                    >
                        <CardContent className="p-0">
                            <div className="aspect-[3/2] relative w-full"> {/* Aspect ratio for image */}
                                <Image
                                    src={journal.imageUrl}
                                    alt={journal.name}
                                    fill
                                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw" // Responsive sizes
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    data-ai-hint={journal.dataAiHint || 'journal cover'}
                                />
                             </div>
                            <div className="p-3">
                                <p className="text-sm font-medium text-card-foreground truncate group-hover:text-primary">
                                    {journal.name}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                 {/* Placeholder for adding a new journal */}
                 {/*
                 <button className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-muted-foreground/50 rounded-lg text-muted-foreground hover:border-foreground hover:text-foreground transition-colors aspect-[3/2]">
                     <Plus className="h-8 w-8 mb-2" />
                     <span className="text-sm font-medium">New Journal</span>
                 </button>
                 */}
            </div>
        </div>
    );
}

    