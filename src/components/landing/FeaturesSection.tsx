import { Monitor, Box, Eye, Layers, Server, Settings } from 'lucide-react';

const features = [
  {
    icon: <Monitor className="h-8 w-8" />,
    title: "2D Görünüm",
    description: "Rack'lerinizi 2 boyutlu olarak görüntüleyin ve düzenleyin."
  },
  {
    icon: <Box className="h-8 w-8" />,
    title: "3D Görünüm",
    description: "Rack'lerinizi 3 boyutlu olarak inceleyin ve yönetin."
  },
  {
    icon: <Eye className="h-8 w-8" />,
    title: "Gerçekçi Görselleştirme",
    description: "Gerçekçi malzeme ve ışıklandırma ile daha iyi bir deneyim."
  },
  {
    icon: <Layers className="h-8 w-8" />,
    title: "Çoklu Rack Desteği",
    description: "Birden fazla rack'i aynı anda görüntüleyin ve yönetin."
  },
  {
    icon: <Server className="h-8 w-8" />,
    title: "Cihaz Yönetimi",
    description: "Rack'lerinizdeki cihazları kolayca ekleyin, düzenleyin ve yönetin."
  },
  {
    icon: <Settings className="h-8 w-8" />,
    title: "Özelleştirilebilir",
    description: "İhtiyaçlarınıza göre özelleştirilebilir arayüz ve özellikler."
  }
];

export function FeaturesSection() {
  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Neden Rack Vision Pro?
            </h2>
            <p className="max-w-[800px] text-muted-foreground md:text-xl">
              Rack Vision Pro ile veri merkezi ve ağ altyapınızı kolayca yönetin.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 pt-12 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center space-y-2 rounded-lg border p-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
