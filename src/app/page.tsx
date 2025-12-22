'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import Image from 'next/image';
import { CldImage } from 'next-cloudinary';
import { services, type Service } from '@/lib/services';
import Hero from '@/components/landing/Hero';
import Stats from '@/components/landing/Stats';
// import Reviews from '@/components/landing/Reviews';
import Destinations from '@/components/landing/Destinations';
import ServiceCard from '@/components/services/ServiceCard';
// import BookingForm from '@/components/services/BookingForm';

const Reviews = nextDynamic(() => import('@/components/landing/Reviews'), {
    loading: () => <div className="h-96 bg-white/5 animate-pulse rounded-xl" />
});

const BookingForm = nextDynamic(() => import('@/components/services/BookingForm'), {
    loading: () => <div className="h-[600px] bg-white/5 animate-pulse rounded-xl" />
});
import nextDynamic from 'next/dynamic';

const RecommendationEngine = nextDynamic(() => import('@/components/ai/RecommendationEngine'), {
  loading: () => <div className="h-64 bg-white/5 animate-pulse rounded-xl" />,
  ssr: false // No need for SEO indexation of dynamic interactive component
});
// import RecommendationEngine from '@/components/ai/RecommendationEngine';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Car, Sparkles, MapPin, Lock } from 'lucide-react';

export default function Home() {
  const [selectedService, setSelectedService] = useState<Service>(services[0]);

  const handleServiceSelect = (slug: string) => {
    const service = services.find(s => s.slug === slug);
    if (service) {
      setSelectedService(service);
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col bg-black min-h-screen">
      <Hero />
      
      <Stats />

      {/* AI Recommendation Section */}
      <Destinations />

      {/* Services Section */}
      <section id="services" className="py-24 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-headline text-3xl md:text-5xl font-bold text-white mb-4">
              Nos <span className="text-primary">Services</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Des transferts privés aux excursions exclusives, nous offrons une gamme complète de services pour rendre votre voyage inoubliable.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <ServiceCard 
                key={service.id} 
                service={service} 
                onBook={handleServiceSelect}
              />
            ))}
          </div>
        </div>
      </section>

      {/* AI Recommendation Section */}
      <section id="recommendations" className="py-20 bg-gradient-to-b from-black to-gray-900 border-b border-white/5">
         <div className="container mx-auto px-4 text-center">
           <div className="inline-block p-3 rounded-full bg-primary/10 mb-6">
             <Sparkles className="w-8 h-8 text-primary" />
           </div>
           <h2 className="font-headline text-3xl md:text-5xl font-bold text-white mb-6">
             Assistant Voyage <span className="text-primary">IA</span>
           </h2>
           <p className="mx-auto max-w-2xl text-lg text-gray-400 mb-12">
            Pas sûr de ce que vous cherchez ? Laissez notre assistant intelligent vous suggérer les meilleures activités pour votre séjour à Essaouira.
           </p>
           <div className="max-w-4xl mx-auto">
             <RecommendationEngine onBook={handleServiceSelect} />
           </div>
         </div>
       </section>

      {/* Reviews Section */}
      <Reviews />

      {/* Contact & Booking Section */}
      <section id="contact" className="py-24 bg-black relative">
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div>
                    <h2 className="font-headline text-4xl md:text-5xl font-bold text-white mb-6">
                        Contact & <br/><span className="text-primary">Réservation</span>
                    </h2>
                    <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                        Remplissez le formulaire pour obtenir un devis gratuit ou réserver directement votre trajet. 
                        Une fois envoyé, nous vous contacterons immédiatement sur <strong>WhatsApp</strong> pour confirmer les détails.
                    </p>
                    
                    <div className="space-y-6">
                        <div className="flex items-center space-x-4 text-white">
                            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                                <Car className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold">Service 24/7</h3>
                                <p className="text-gray-400">Disponible jour et nuit</p>
                            </div>
                        </div>
                         <div className="flex items-center space-x-4 text-white">
                            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                                <MapPin className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold">Couverture Nationale</h3>
                                <p className="text-gray-400">Marrakech, Essaouira, Agadir, etc.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-3xl border border-white/10 shadow-2xl">
                    <div className="mb-6 pb-6 border-b border-white/10">
                        <p className="text-sm text-gray-400 uppercase tracking-widest mb-2">Service Sélectionné</p>
                        <h3 className="text-2xl font-bold text-primary flex items-center">
                            {selectedService.name}
                        </h3>
                    </div>
                    <BookingForm service={selectedService} />

                    <div className="mt-8 pt-6 border-t border-white/10 text-center">
                        <p className="text-sm text-gray-400 mb-4 flex items-center justify-center gap-2 font-medium">
                            <Lock className="w-4 h-4 text-primary" /> Paiement Sécurisé Avec
                        </p>
                        <div className="flex justify-center items-center opacity-90 transition-opacity hover:opacity-100">
                             <CldImage 
                                src="https://res.cloudinary.com/doy1q2tfm/image/upload/v1766386708/Paiment-Securise-Avec_fc8loh.png" 
                                alt="Paiement Sécurisé : Visa, Mastercard, PayPal" 
                                width={250}
                                height={80}
                                className="h-20 w-auto object-contain"
                             />
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
}

    