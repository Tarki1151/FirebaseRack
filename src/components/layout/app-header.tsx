
import { MountainSnow } from "lucide-react"; // Using MountainSnow as a placeholder logo icon
import Link from "next/link";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/design" className="flex items-center gap-2">
          <MountainSnow className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-primary">Rack Vision</span>
        </Link>
        {/* Placeholder for future actions like user profile, settings */}
      </div>
    </header>
  );
}
