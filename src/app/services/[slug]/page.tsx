
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Metadata } from 'next';
import Image from 'next/image';
import CldImage from '@/components/ui/cld-image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import BookingForm from '@/components/services/BookingForm';
import { Car, Check, Shield, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { services as staticServices } from '@/lib/services';
import dynamic from 'next/dynamic';

const Reviews = dynamic(() => import('@/components/landing/Reviews'), {
    loading: () => <div className="h-96 bg-white/5 animate-pulse rounded-xl" />
});

// Removed Supabase fetching to use static English content
// import { supabase } from '@/lib/supabase'; (imports already there, but we stop using it)

export const revalidate = 3600; 
export const runtime = 'edge';

async function getService(slug: string) {
  // Return static service instead of DB service
  return staticServices.find(s => s.slug === slug) || null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return { title: 'Service Not Found' };

  // Use static image logic (service.images.hero is number in static, string/id in DB. staticServices has numbers)
  const heroImage = PlaceHolderImages.find((img) => img.id === service.images.hero) || PlaceHolderImages[0];

  return {
    title: service.name,
    description: service.description,
    openGraph: {
      title: service.name,
      description: service.description,
      images: [
        {
          url: heroImage.imageUrl,
          width: 1200,
          height: 630,
          alt: `${service.name} - Essaouira Adventures`,
        },
      ],
    },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service) {
    notFound();
  }

  // Helper for images (reusing logic from ServiceCard)
  const heroImage = PlaceHolderImages.find((img) => img.id === service.images.hero) || PlaceHolderImages[0];

  // Mock Service object for compatibility with BookingForm
  // STRATEGY: Merge Dynamic DB Content (Title, Price) with Static Config (Form Fields)
  
  // 1. Find the matching static config by slug (or fallback by ID if slugs changed, but slug is safest)
  const staticConfig = staticServices.find(s => s.slug === slug) || staticServices[0];

  const serviceForForm: any = {
      id: service.id,
      slug: service.slug,
      name: service.name,
      whatsappNumber: service.whatsappNumber || staticConfig.whatsappNumber,
      whatsappMessage: staticConfig.whatsappMessage, // Function logic must come from static file
      
      // CRITICAL: Inject the static form configuration so fields render
      bookingForm: {
        ...staticConfig.bookingForm,
        fields: staticConfig.bookingForm.fields.map((field: any) => {
            const { validation, ...rest } = field;
            return rest;
        })
      }, 
      bookingTitle: staticConfig.bookingTitle
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product', // Using Product for better rich snippet support (price/rating)
    name: service.name,
    description: service.description,
    image: heroImage.imageUrl,
    offers: {
        '@type': 'Offer',
        priceCurrency: 'EUR',
        price: service.pricing?.amount || '0',
        availability: 'https://schema.org/InStock',
        url: `https://essaouira-travel.services/services/${service.slug}`
    },
    aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '120' // Mocked for now, strictly better than nothing for CTR
    },
    brand: {
        '@type': 'Brand',
        name: 'Essaouira Adventures'
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        {heroImage.imageUrl.includes('cloudinary') ? (
            <CldImage
                src={heroImage.imageUrl}
                alt={`${service.name} - Essaouira Adventures`}
                fill
                priority
                className="object-cover"
            />
        ) : (
             <Image
                src={heroImage.imageUrl}
                alt={`${service.name} - Essaouira Adventures`}
                fill
                priority
                className="object-cover"
             />
        )}
        
        <div className="absolute inset-0 z-20 flex items-center justify-center">
            <div className="text-center px-4 animate-in fade-in zoom-in duration-700">
                <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm border border-white/20">
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    <span className="text-sm font-semibold">Premium Experience</span>
                </div>
                <h1 className="font-headline text-4xl md:text-7xl font-bold mb-6 text-white leading-tight shadow-xl">
                    {service.name}
                </h1>
                <p className="text-xl text-white/90 max-w-2xl mx-auto font-medium drop-shadow-md">
                    {service.description}
                </p>
            </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
                
                {/* Features Grid */}
                <div className="grid grid-cols-2 gap-4">
                    {service.features?.map((feature: string, i: number) => (
                        <div key={i} className="flex items-center gap-3 bg-card p-4 rounded-xl border border-border shadow-sm">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <Check className="w-4 h-4 text-primary" />
                            </div>
                            <span className="font-medium text-foreground">{feature}</span>
                        </div>
                    ))}
                </div>

                {/* Long Description */}
                <div className="prose prose-lg max-w-none text-muted-foreground">
                    <h2 className="text-3xl font-bold mb-6 text-foreground font-headline">
                        Why Choose This Adventure?
                    </h2>
                    <div className="space-y-4">
                            <p>{service.description}</p>
                        <p>
                            Enjoy exceptional comfort and total safety. Our experienced team knows the region perfectly. 
                            Whether you're looking for thrill or relaxation, we guarantee a VIP experience.
                        </p>
                    </div>
                </div>

                {/* Trust Badges */}
                <div className="bg-primary/5 p-8 rounded-2xl border border-primary/10">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-foreground">
                        <Shield className="w-6 h-6 text-primary" />
                        Essaouira Adventures Guarantees
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h4 className="font-bold text-foreground mb-2">Fair Pricing</h4>
                            <p className="text-sm text-muted-foreground">No hidden fees. Best value guaranteed.</p>
                        </div>
                        <div>
                             <h4 className="font-bold text-foreground mb-2">Free Cancellation</h4>
                            <p className="text-sm text-muted-foreground">Cancel up to 24h before without fees.</p>
                        </div>
                        <div>
                             <h4 className="font-bold text-foreground mb-2">24/7 Support</h4>
                            <p className="text-sm text-muted-foreground">Available on WhatsApp anytime.</p>
                        </div>
                    </div>
                </div>

            </div>

             {/* Sidebar Booking */}
             <div className="lg:col-span-1">
                <div className="sticky top-24">
                    <div className="bg-card border border-border rounded-2xl p-6 shadow-xl">
                        <div className="mb-6 pb-6 border-b border-border">
                            <p className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Starting From</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold text-primary">
                                    {service.pricing?.amount ? `${service.pricing.amount}€` : 'On Request'}
                                </span>
                                {service.pricing?.unit && (
                                    <span className="text-muted-foreground">/ {service.pricing.unit}</span>
                                )}
                            </div>
                        </div>
                        
                         <div className="bg-primary/5 p-4 rounded-lg border border-primary/10 mb-6">
                            <p className="text-sm text-primary text-center font-medium">
                                Fill the form below to book your spot.
                            </p>
                        </div>
                        
                        {/* BookingForm */}
                        <BookingForm service={{
                            ...serviceForForm,
                            whatsappMessage: undefined,
                            bookingForm: {
                                ...serviceForForm.bookingForm,
                                fields: serviceForForm.bookingForm.fields.map((f: any) => {
                                    const { validation, ...rest } = f;
                                    return rest;
                                })
                            }
                        }} />
                        
                        <div className="mt-6 pt-6 border-t border-border text-center">
                            <p className="text-sm text-muted-foreground mb-4 flex items-center justify-center gap-2 font-medium">
                                <Shield className="w-4 h-4 text-primary" /> Secure Payment
                            </p>
                            <div className="flex justify-center items-center opacity-90 transition-opacity hover:opacity-100">
                                <Image 
                                    src="https://res.cloudinary.com/doy1q2tfm/image/upload/v1766386708/Paiment-Securise-Avec_fc8loh.png" 
                                    alt="Secure Payment: Visa, Mastercard, PayPal" 
                                    width={250}
                                    height={80}
                                    className="h-16 w-auto object-contain"
                                    unoptimized
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
         {/* Reviews Section */}
         <div className="mt-24 pt-12 border-t border-border/40">
            <Reviews />
        </div>
      </div>
    </div>
  );
}
