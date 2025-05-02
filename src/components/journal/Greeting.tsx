
"use client";

import { useState, useEffect } from 'react';

export default function Greeting() {
  const [greeting, setGreeting] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good morning.');
    } else if (hour < 18) {
      setGreeting('Good afternoon.');
    } else {
      setGreeting('Good evening.');
    }
  }, []);

  if (!isMounted) {
     // Optional: Render a placeholder or nothing during SSR
     return null;
  }


  return (
    <h1 className="text-3xl font-bold text-foreground">
      {greeting}
    </h1>
  );
}
