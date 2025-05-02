
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
// Removed GeistMono import as it was causing errors
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; // Import Toaster

export const metadata: Metadata = {
  title: 'TaskGrid', // Updated App Name
  description: 'Organize your tasks and journal your progress.', // Updated Description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Apply dark theme by default, Geist Sans font, and ensure full height layout
    <html lang="en" className="dark h-full">
      <body className={`${GeistSans.variable} font-sans antialiased flex flex-col h-full`}>
        {children}
        <Toaster /> {/* Add Toaster component here */}
      </body>
    </html>
  );
}
