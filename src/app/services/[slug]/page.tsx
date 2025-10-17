
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { services, Service } from '@/lib/services';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Zap, TrendingUp } from 'lucide-react';
import BookingForm from '@/components/services/BookingForm';
import type { Metadata } from 'next';

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = services.find((s) => s.slug === params.slug);

  if (!service) {
    return {
      title: 'Service Not Found',
    };
  }

  return {
    title: `${service.name} | Moroccan Coastal Adventures`,
    description: service.description.substring(0, 150),
  };
}

export function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

const getService = (slug: string): Service | undefined => {
  return services.find((s) => s.slug === slug);
};

export default function ServicePage({ params }: { params: { slug: string } }) {
  const serviceData = getService(params.slug);

  if (!serviceData) {
    notFound();
  }

  // Create a serializable version of the service object
  const { whatsappMessage, ...serializableServiceData } = serviceData as any;
  const service = {
    ...serializableServiceData,
    bookingForm: {
      ...serializableServiceData.bookingForm,
      fields: serializableServiceData.bookingForm.fields.map(({ validation, ...field }: any) => field),
    },
  };

  const heroImage = PlaceHolderImages.find((img) => img.id === service.images.hero);
  const galleryImages = service.images.gallery.map((id) =>
    PlaceHolderImages.find((img) => img.id === id)
  );

  const icons = [<CheckCircle key="1" />, <Zap key="2" />, <TrendingUp key="3" />, <CheckCircle key="4" />];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[50vh] w-full text-white">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
          <h1 className="font-headline text-5xl font-bold md:text-7xl">
            {service.name}
          </h1>
        </div>
      </section>

      <div className="container mx-auto py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
             {/* Description and Features */}
            <section>
              <h2 className="font-headline text-4xl text-primary">{service.aboutTitle}</h2>
              <p className="mt-4 text-lg text-foreground/80">{service.description}</p>
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {service.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="text-primary">{icons[index % icons.length]}</div>
                    <span className="font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </section>
             {/* Image Gallery */}
            <section>
              <h2 className="font-headline text-4xl text-primary">Gallery</h2>
               <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                 {galleryImages.map((img, index) =>
                   img ? (
                     <div key={index} className="relative aspect-w-4 aspect-h-3 overflow-hidden rounded-lg shadow-md">
                       <Image
                         src={img.imageUrl}
                         alt={img.description}
                         fill
                         className="object-cover transition-transform duration-300 hover:scale-105"
                         data-ai-hint={img.imageHint}
                       />
                     </div>
                   ) : null
                 )}
               </div>
            </section>
          </div>
          
          {/* Booking Form Card */}
          <aside className="lg:col-span-1">
             <Card className="sticky top-24 shadow-xl">
               <CardHeader>
                 <CardTitle className="font-headline text-3xl text-primary">
                    {service.bookingTitle}
                 </CardTitle>
               </CardHeader>
               <CardContent>
                 <BookingForm service={service as Service} />
               </CardContent>
             </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
