
'use client';

import React from 'react';
import { ThemeProvider } from '@/context/ThemeProvider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="light" storageKey="eduquest-theme">
      {children}
    </ThemeProvider>
  );
}
