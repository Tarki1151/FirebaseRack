
import { AppHeader } from "@/components/layout/app-header";
import { AppNavigation } from "@/components/layout/app-navigation";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider>
      <div className="flex min-h-screen flex-col">
        <AppHeader />
        <AppNavigation />
        <main className="flex-1 container py-6">{children}</main>
        <footer className="py-6 md:px-8 md:py-0 bg-background border-t">
          <div className="container flex flex-col items-center justify-between gap-4 md:h-20 md:flex-row">
            <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
              Built with Next.js and ShadCN UI.
            </p>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  );
}
