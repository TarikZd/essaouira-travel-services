'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { services, type Service } from '@/lib/services';
import Hero from '@/components/landing/Hero';
import ServiceCard from '@/components/services/ServiceCard';
import SimpleContactForm from '@/components/landing/SimpleContactForm';
import { Compass, CreditCard } from 'lucide-react';

export default function Home() {
  const [selectedService, setSelectedService] = useState<Service>(services[0]);

  const handleServiceSelect = (slug: string) => {
    const service = services.find(s => s.slug === slug);
    if (service) {
      setSelectedService(service);
      setTimeout(() => {
        document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  return (
    <div className="flex flex-col bg-background min-h-screen">
      <Hero />
      
      {/* Services Section */}
      <section id="services" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-headline text-3xl md:text-5xl font-bold text-foreground mb-4">
              Our <span className="text-primary">Adventures</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From culinary adventures to coastal excursions, we create unforgettable Moroccan experiences.
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

      {/* Contact & Booking Section */}
      <section id="contact" className="py-24 bg-background relative">
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                    <h2 className="font-headline text-4xl md:text-5xl font-bold text-foreground mb-6">
                        Start Your <br/><span className="text-primary">Adventure</span>
                    </h2>
                    <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                        Ready to explore Essaouira? Contact us to plan your perfect trip. 
                        We reply immediately on WhatsApp to confirm availability and details.
                    </p>
                    
                    <div className="space-y-8">
                        <div className="flex items-start space-x-4 text-foreground">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <Compass className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold text-xl mb-1">Authentic Adventures</h3>
                                <p className="text-muted-foreground">From immersive Cooking Classes to scenic Hiking and Fishing trips.</p>
                            </div>
                        </div>
                         <div className="flex items-start space-x-4 text-foreground">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <CreditCard className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold text-xl mb-1">Easy Deposit Booking</h3>
                                <p className="text-muted-foreground">Secure your spot with a small deposit. Pay the rest on arrival.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="booking-form" className="scroll-mt-32">
                    <SimpleContactForm />
                </div>
            </div>
        </div>
      </section>
    </div>
  );
}