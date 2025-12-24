
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

export const revalidate = 3600; // Revalidate every hour

async function getService(slug: string) {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    return null;
  }
  return data;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return { title: 'Service Not Found' };

  return {
    title: `${service.name} | Essaouira Travel Services`,
    description: service.description || 'Réservez votre service de transport.',
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service) {
    notFound();
  }

  // Helper for images (reusing logic from ServiceCard)
  const heroImage = PlaceHolderImages.find((img) => img.id === service.image_hero) || PlaceHolderImages[0];

  // Mock Service object for compatibility with BookingForm
  // STRATEGY: Merge Dynamic DB Content (Title, Price) with Static Config (Form Fields)
  
  // 1. Find the matching static config by slug (or fallback by ID if slugs changed, but slug is safest)
  const staticConfig = staticServices.find(s => s.slug === slug) || staticServices[0];

  const serviceForForm: any = {
      id: service.id, // ID from DB
      slug: service.slug,
      name: service.name, // Name from DB
      whatsappNumber: service.whatsapp_number || staticConfig.whatsappNumber,
      whatsappMessage: staticConfig.whatsappMessage, // Function logic must come from static file
      
      // CRITICAL: Inject the static form configuration so fields render
      bookingForm: {
        ...staticConfig.bookingForm,
        fields: staticConfig.bookingForm.fields.map(field => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { validation, ...rest } = field;
            return rest;
        })
      }, 
      bookingTitle: staticConfig.bookingTitle
  };


  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10" />
        {heroImage.imageUrl.includes('cloudinary') ? (
            <CldImage
                src={heroImage.imageUrl}
                alt={service.name}
                fill
                className="object-cover"
            />
        ) : (
             <Image
                src={heroImage.imageUrl}
                alt={service.name}
                fill
                className="object-cover"
             />
        )}
        
        <div className="absolute inset-0 z-20 flex items-center justify-center">
            <div className="text-center px-4">
                <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm border border-primary/20">
                    <Star className="w-4 h-4 fill-primary" />
                    <span className="text-sm font-semibold">Service Premium 5 Étoiles</span>
                </div>
                <h1 className="font-headline text-4xl md:text-7xl font-bold mb-6 text-white leading-tight">
                    {service.name}
                </h1>
                <p className="text-xl text-gray-200 max-w-2xl mx-auto">
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
                        <div key={i} className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/10">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                <Check className="w-4 h-4 text-primary" />
                            </div>
                            <span className="font-medium text-gray-200">{feature}</span>
                        </div>
                    ))}
                </div>

                {/* Long Description (The SEO Content) */}
                <div className="prose prose-invert max-w-none">
                    <h2 className="text-3xl font-bold mb-6 text-white font-headline">
                        Pourquoi choisir ce service ?
                    </h2>
                    <div className="text-gray-300 leading-relaxed space-y-4">
                        {/* If long_description is empty, fallback to description */}
                        {service.long_description ? (
                            <div dangerouslySetInnerHTML={{ __html: service.long_description }} /> // Secure this later if user input
                        ) : (
                            <p>{service.description}</p>
                        )}
                        <p>
                            Profitez d'un confort exceptionnel et d'une sécurité totale. Nos chauffeurs expérimentés 
                            connaissent parfaitement les routes du Maroc. Que vous voyagiez de Marrakech à Essaouira 
                            ou vers l'aéroport, nous garantissons ponctualité et service VIP.
                        </p>
                    </div>
                </div>

                {/* Trust Badges */}
                <div className="bg-gradient-to-r from-gray-900 to-black p-8 rounded-2xl border border-white/10">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Shield className="w-6 h-6 text-primary" />
                        Garanties Essaouira Travel
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h4 className="font-bold text-white mb-2">Prix Fixe</h4>
                            <p className="text-sm text-gray-400">Aucune surprise, tout est inclus (carburant, péage, assurance).</p>
                        </div>
                        <div>
                             <h4 className="font-bold text-white mb-2">Annulation Gratuite</h4>
                            <p className="text-sm text-gray-400">Annulez jusqu'à 24h avant sans frais.</p>
                        </div>
                        <div>
                             <h4 className="font-bold text-white mb-2">Support 24/7</h4>
                            <p className="text-sm text-gray-400">Une équipe disponible sur WhatsApp à tout moment.</p>
                        </div>
                    </div>
                </div>

            </div>

             {/* Sidebar Booking */}
             <div className="lg:col-span-1">
                <div className="sticky top-24">
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl">
                        <div className="mb-6 pb-6 border-b border-white/10">
                            <p className="text-sm text-gray-400 uppercase tracking-widest mb-1">À partir de</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold text-primary">
                                    {service.price_amount ? `${service.price_amount}€` : 'Sur Devis'}
                                </span>
                                {service.price_unit && (
                                    <span className="text-gray-400">/ {service.price_unit}</span>
                                )}
                            </div>
                        </div>
                        
                        {/* We will need to adapt the BookingForm to work with this data structure */}
                        <div className="bg-blue-900/10 p-4 rounded-lg border border-blue-500/20 mb-6">
                            <p className="text-sm text-blue-200 text-center">
                                Remplissez le formulaire ci-dessous pour réserver.
                            </p>
                        </div>
                        
                        {/* Use a sanitized version of service for the client component to avoid serialization errors with functions */}
                  <BookingForm service={{
                    ...serviceForForm,
                    whatsappMessage: undefined, // Remove function
                    bookingForm: {
                        ...serviceForForm.bookingForm,
                        fields: serviceForForm.bookingForm.fields.map(f => {
                             // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            const { validation, ...rest } = f;
                            return rest;
                        })
                    }
                  }} />
                        
                        <p className="text-xs text-center text-gray-500 mt-4">
                            Paiement sécurisé sur place ou par lien bancaire.
                        </p>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}
