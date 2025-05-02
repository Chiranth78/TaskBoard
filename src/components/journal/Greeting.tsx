
"use client";

import { useState, useEffect } from 'react';
import { Skeleton } from "@/components/ui/skeleton";

function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) {
        return "Good morning.";
    } else if (hour < 18) {
        return "Good afternoon.";
    } else {
        return "Good evening.";
    }
}

export default function Greeting() {
    const [greeting, setGreeting] = useState<string | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        setGreeting(getGreeting());
    }, []);

    if (!isMounted) {
        return <Skeleton className="h-8 w-48" />; // Adjust size as needed
    }

    return (
        <h2 className="text-3xl font-bold text-foreground">
            {greeting}
        </h2>
    );
}

    