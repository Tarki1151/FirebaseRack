import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function CallToActionSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Hemen Başlayın
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Rack Vision Pro ile veri merkezi yönetimini bir üst seviyeye taşıyın. 
              Ücretsiz denemeye başlayın ve farkı görün.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Link href="/design">
              <Button size="lg">Ücretsiz Deneyin</Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline">
                Daha Fazla Bilgi Alın
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
