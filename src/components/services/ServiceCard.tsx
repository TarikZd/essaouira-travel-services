import Image from 'next/image';
import Link from 'next/link';
import { CldImage } from 'next-cloudinary';
import { ArrowRight, Car, ChefHat, Mountain, Map, Bike, Star, Anchor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Service } from '@/lib/services';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';

type ServiceCardProps = {
  service: Service;
  onBook?: (serviceId: string) => void;
};

export default function ServiceCard({ service, onBook }: ServiceCardProps) {
  const cardImage = PlaceHolderImages.find((img) => img.id === service.images.card);
  const shortDescription = service.description.split('. ')[0] + '.';

  const getIcon = (id: number) => {
    switch (id) {
      case 1: return <Car className="h-10 w-10 text-primary mb-4" />;
      case 5: return <ChefHat className="h-10 w-10 text-primary mb-4" />;
      case 4: return <Mountain className="h-10 w-10 text-primary mb-4" />;
      case 3: return <Map className="h-10 w-10 text-primary mb-4" />;
      case 2: return <Bike className="h-10 w-10 text-primary mb-4" />;
      case 6: return <Anchor className="h-10 w-10 text-primary mb-4" />;
      default: return <Car className="h-10 w-10 text-primary mb-4" />;
    }
  };

  return (
    <Card className="group flex h-full flex-col overflow-hidden bg-white/5 border-white/10 hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10">
      <CardHeader className="relative h-64 w-full p-0 overflow-hidden">
        {cardImage && (
          <Link href={`/services/${service.slug}`} className="block h-full w-full group-hover:scale-105 transition-transform duration-700">
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
            
            {/* Price Badge */}
            <div className="absolute top-4 right-4 z-20 bg-accent text-accent-foreground px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
              {service.pricing?.amount ? `from ${service.pricing.amount}€` : 'On Request'}
            </div>

            {cardImage.imageUrl.includes('cloudinary') ? (
              <CldImage
                src={cardImage.imageUrl}
                alt={`${service.name} - Essaouira Concierge`}
                fill
                format="auto"
                quality="auto:eco"
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <Image
                src={cardImage.imageUrl}
                alt={`${service.name} - Essaouira Concierge`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            )}
            
            <div className="absolute bottom-4 left-5 z-20">
              <div className="flex items-center gap-2 mb-2">
                 {getIcon(service.id)}
                 <span className="text-primary text-xs font-bold tracking-widest uppercase bg-primary/10 px-2 py-0.5 rounded border border-primary/20">Premium Service</span>
              </div>
              <CardTitle className="font-headline text-2xl text-white group-hover:text-primary transition-colors leading-tight">
                {service.name}
              </CardTitle>
            </div>
          </Link>
        )}
      </CardHeader>
      <CardContent className="flex-grow p-6">
        <p className="text-gray-400 leading-relaxed">
          {shortDescription}
        </p>
        <ul className="mt-4 space-y-2">
            {service.features.slice(0, 2).map((feature, i) => (
                <li key={i} className="flex items-center text-sm text-gray-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                    {feature}
                </li>
            ))}
        </ul>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Link href={`/services/${service.slug}`} className="w-full">
            <Button 
                className="w-full bg-primary text-black hover:bg-yellow-500 font-bold group-hover:scale-[1.02] transition-transform"
            >
              Plus de détails <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
