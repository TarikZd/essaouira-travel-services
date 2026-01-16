'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import Image from 'next/image';
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

import { Car, MapPin, Lock } from 'lucide-react';

export default function Home() {
  const [selectedService, setSelectedService] = useState<Service>(services[0]);

  const handleServiceSelect = (slug: string) => {
    const service = services.find(s => s.slug === slug);
    if (service) {
      setSelectedService(service);
      // Small timeout to allow state update before scrolling
      setTimeout(() => {
        document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  return (
    <div className="flex flex-col bg-black min-h-screen">
      <Hero />
      
      <Stats />

      {/* AI Recommendation Section */}
      <Destinations />

      {/* Services Section */}
      <section id="services" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-headline text-3xl md:text-5xl font-bold text-foreground mb-4">
              Our <span className="text-primary">Services</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From private transfers to exclusive excursions, we offer a complete range of services to make your trip unforgettable.
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

      {/* Reviews Section */}
      <Reviews />

      {/* Contact & Booking Section */}
      <section id="contact" className="py-24 bg-background relative">
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div>
                    <h2 className="font-headline text-4xl md:text-5xl font-bold text-foreground mb-6">
                        Contact & <br/><span className="text-primary">Booking</span>
                    </h2>
                    <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                        Fill the form to get a quote or book your ride directly. 
                        Once sent, we will contact you immediately on <strong>WhatsApp</strong> to confirm details.
                    </p>
                    
                    <div className="space-y-6">
                        <div className="flex items-center space-x-4 text-foreground">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <Car className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold">24/7 Service</h3>
                                <p className="text-muted-foreground">Available day and night</p>
                            </div>
                        </div>
                         <div className="flex items-center space-x-4 text-foreground">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <MapPin className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold">National Coverage</h3>
                                <p className="text-muted-foreground">Marrakech, Essaouira, Agadir, etc.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="booking-form" className="bg-card backdrop-blur-sm p-8 rounded-3xl border border-border shadow-md scroll-mt-32">
                    <div className="mb-6 pb-6 border-b border-border">
                        <p className="text-sm text-muted-foreground uppercase tracking-widest mb-2">Selected Service</p>
                        <h3 className="text-2xl font-bold text-primary flex items-center">
                            {selectedService.name}
                        </h3>
                    </div>
                    <BookingForm service={selectedService} />

                    <div className="mt-8 pt-6 border-t border-border text-center">
                        <p className="text-sm text-muted-foreground mb-4 flex items-center justify-center gap-2 font-medium">
                            <Lock className="w-4 h-4 text-primary" /> Secured Payment
                        </p>
                        <div className="flex justify-center items-center opacity-90 transition-opacity hover:opacity-100">
                             <Image 
                                src="https://res.cloudinary.com/doy1q2tfm/image/upload/v1766386708/Paiment-Securise-Avec_fc8loh.png" 
                                alt="Secured Payment: Visa, Mastercard, PayPal" 
                                width={250}
                                height={80}
                                className="h-20 w-auto object-contain"
                                unoptimized
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

    