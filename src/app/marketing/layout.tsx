import { cn } from '@/lib/utils';
import { MarketingHeader } from '@/components/landing/MarketingHeader';
import { Footer } from '@/components/landing/Footer';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <MarketingHeader />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
