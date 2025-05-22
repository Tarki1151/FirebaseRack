// src/components/layout/app-header.tsx
'use client';

import { MountainSnow } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useCallback } from 'react';
import { ViewToggle } from "@/components/ui/view-toggle";
import { useRackVision, type ViewMode } from "@/store/rack-vision-store";

export function AppHeader() {
  const { viewMode, setViewMode } = useRackVision();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    console.log("[AppHeader useEffect] Pathname:", pathname, "Current store viewMode BEFORE sync:", viewMode);
    let newModeDeterminedByPath: ViewMode | null = null;

    if (pathname === '/design/3d') {
      newModeDeterminedByPath = '3D';
    } else if (pathname === '/design' || pathname.startsWith('/cabinet/')) { // Cabinet pages default global toggle to 2D context
      newModeDeterminedByPath = '2D';
    }

    if (newModeDeterminedByPath && newModeDeterminedByPath !== viewMode) {
      console.log(`[AppHeader useEffect] Path is ${pathname}. Syncing store.viewMode from ${viewMode} to ${newModeDeterminedByPath}.`);
      setViewMode(newModeDeterminedByPath);
    }
  }, [pathname, viewMode, setViewMode]);

  const navigateOnViewChange = useCallback((requestedMode: ViewMode) => {
    console.log(`[AppHeader navigateOnViewChange] Requested mode: ${requestedMode}. Current pathname: ${pathname}`);
    
    if (requestedMode === "3D") {
      if (pathname !== '/design/3d') {
        console.log("[AppHeader navigateOnViewChange] Navigating to /design/3d");
        router.push("/design/3d");
      }
    } else { // requestedMode === "2D"
      if (pathname !== '/design') { // If not already on /design, navigate there
        console.log("[AppHeader navigateOnViewChange] Navigating to /design for 2D mode");
        router.push("/design");
      }
    }
  }, [router, pathname]); // Removed viewMode from dependencies as it's synced by useEffect

  // Show global view toggle ONLY on /design or /design/3d pages.
  const showGlobalViewToggle = pathname === '/design' || pathname === '/design/3d';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/design" className="flex items-center gap-2">
          <MountainSnow className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-primary">Rack Vision</span>
        </Link>
        <div className="ml-auto flex items-center space-x-4">
          {showGlobalViewToggle && (
            <ViewToggle 
              viewMode={viewMode} 
              onViewModeChange={navigateOnViewChange} 
            />
          )}
        </div>
      </div>
    </header>
  );
}
