// src/components/layout/app-header.tsx
'use client';

import { MountainSnow } from "lucide-react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useRackVision } from "@/store/rack-vision-store";

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/design" className="flex items-center gap-2">
          <MountainSnow className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-primary">Rack Vision</span>
        </Link>
        <div className="ml-auto">
          {/* Additional header items can go here */}
        </div>
      </div>
    </header>
  );
}
