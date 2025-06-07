
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AppProviders } from '@/components/AppProviders';

export const metadata: Metadata = {
  title: 'EduQuest: Compassionate Learning',
  description: 'Inovasi Gamifikasi Kolaboratif untuk Menumbuhkan Cinta Kasih melalui Pembelajaran Interaktif',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Removed Nunito font import */}
      </head>
      <body className="font-sans antialiased"> {/* Changed from font-body to font-sans */}
        <AppProviders>
          {children}
          <Toaster />
        </AppProviders>
      </body>
    </html>
  );
}
