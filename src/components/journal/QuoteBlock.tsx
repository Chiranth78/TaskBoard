
import { Separator } from '@/components/ui/separator'; // Assuming you might want separators

interface QuoteBlockProps {
    quote: string;
    author: string;
}

export default function QuoteBlock({ quote, author }: QuoteBlockProps) {
    return (
        <blockquote className="mt-6 border-l-2 pl-6 italic text-muted-foreground">
           "{quote}"
           <footer className="mt-2 text-sm not-italic">- {author}</footer>
        </blockquote>
    );
}

    