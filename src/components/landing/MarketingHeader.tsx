import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative w-10 h-10">
              <Image
                src="/images/logo.png"
                alt="Rack Vision Pro"
                fill
                className="rounded-md object-contain"
              />
            </div>
            <span className="font-bold inline-block">Rack Vision Pro</span>
          </Link>
        </div>
        <nav className="flex items-center space-x-4">
          <Link 
            href="#features" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Özellikler
          </Link>
          <Link 
            href="/design" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Uygulamaya Git
          </Link>
        </nav>
      </div>
    </header>
  );
}
