
"use client";

// TODO: Fetch a random quote or cycle through a list
const quote = "One way to get the most out of life is to look upon it as an adventure.";
const author = "William Feather";

export default function QuoteBlock() {
  return (
    <blockquote className="mt-6 border-l-2 border-border pl-6 italic text-muted-foreground">
      {quote}
      <cite className="block text-right text-sm not-italic mt-2">- {author}</cite>
    </blockquote>
  );
}
