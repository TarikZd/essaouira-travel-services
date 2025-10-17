
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Service } from '@/lib/services';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type ServiceCardProps = {
  service: Service;
};

export default function ServiceCard({ service }: ServiceCardProps) {
  const cardImage = PlaceHolderImages.find((img) => img.id === service.images.card);
  const shortDescription = service.description.split('. ')[0] + '.';

  return (
    <Card className="flex h-full flex-col overflow-hidden transition-shadow duration-300 hover:shadow-xl">
      <CardHeader className="relative h-48 w-full p-0">
        {cardImage && (
          <Image
            src={cardImage.imageUrl}
            alt={cardImage.description}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            data-ai-hint={cardImage.imageHint}
          />
        )}
      </CardHeader>
      <CardContent className="flex-grow p-6">
        <CardTitle className="font-headline text-2xl text-primary">{service.name}</CardTitle>
        <p className="mt-2 text-sm text-muted-foreground">
          {shortDescription}
        </p>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button asChild variant="link" className="p-0 text-primary">
          <Link href={`/services/${service.slug}`}>
            Learn More <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
