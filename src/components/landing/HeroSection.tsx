'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TemplateDownloadButton } from './TemplateDownloadButton';

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background to-muted/30">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Rack Vision Pro
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Profesyonel veri merkezi ve ağ dolabı yönetim çözümü. Rack'lerinizi 2D ve 3D olarak görüntüleyin, yönetin ve planlayın.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/design">
                  <Button size="lg">Hemen Başla</Button>
                </Link>
                <TemplateDownloadButton />
              </div>
              <Link href="#features">
                <Button size="lg" variant="outline">
                  Daha Fazla Bilgi
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-[400px] aspect-square rounded-xl bg-background p-2 shadow-2xl">
              <Image
                src="/images/logo_high.png"
                alt="Rack Vision Pro"
                fill
                className="rounded-lg object-contain p-4"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
