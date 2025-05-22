'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

interface ThemeProviderProps {
  children: React.ReactNode;
  forcedTheme?: string;
  storageKey?: string;
}

export function ThemeProvider({ 
  children, 
  forcedTheme,
  storageKey = 'theme'
}: ThemeProviderProps) {
  return (
    <NextThemesProvider 
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      forcedTheme={forcedTheme}
      storageKey={storageKey}
    >
      {children}
    </NextThemesProvider>
  );
}
