// src/components/layout/app-header.tsx
'use client';

import Link from "next/link";
import Image from "next/image";
import { usePathname } from 'next/navigation';
import { useRackVision } from "@/store/rack-vision-store";
import { Download, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/design" className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">Rack Vision</span>
          </Link>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/">
                  <Home className="h-4 w-4" />
                  <span className="sr-only">Ana Sayfaya Dön</span>
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Ana Sayfaya Dön</TooltipContent>
          </Tooltip>
        </div>
        <div className="flex items-center gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2" asChild>
                <a href="/templates/input_template_new.xlsx" download="rack_vision_template.xlsx">
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Şablon İndir</span>
                  <span className="sr-only sm:hidden">Şablonu İndir</span>
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Excel Şablonunu İndir</TooltipContent>
          </Tooltip>
          <div className="relative h-8 w-24">
            <Image
              src="/images/logo.png"
              alt="Rack Vision Pro"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </header>
  );
}
