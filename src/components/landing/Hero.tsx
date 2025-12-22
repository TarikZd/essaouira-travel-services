'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import { CldImage } from 'next-cloudinary';

export default function Hero() {

  const scrollToContact = () => {
    document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const openWhatsApp = () => {
    window.open('https://wa.me/212690606068', '_blank');
  };

  return (
    <section id="hero" className="relative h-screen min-h-[600px] w-full overflow-hidden flex items-center justify-center">
      {/* Background and Overlay */}
      <div className="absolute inset-0 z-0">
        <CldImage
          src="https://res.cloudinary.com/doy1q2tfm/image/upload/v1766382491/chauffeur-prive-mercedes-maroc_lhcxf5.jpg"
          alt="Taxi Marrakech Essaouira Transport"
          fill
          priority
          format="auto"
          quality="auto:eco"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold font-headline text-white tracking-tight">
            Taxi Transport <br />
            <span className="text-primary">Touristique</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto font-light">
            Transferts rapides, confortables et sécurisés entre Marrakech, Essaouira et Agadir.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Button 
                onClick={scrollToContact}
                size="lg" 
                className="bg-primary text-black hover:bg-yellow-500 font-bold px-8 py-6 text-lg rounded-full w-full sm:w-auto transition-transform hover:scale-105"
            >
              Réserver Maintenant
            </Button>
            
            <Button 
                onClick={openWhatsApp}
                variant="outline" 
                size="lg" 
                className="bg-black/80 text-primary border-primary hover:bg-primary hover:text-black font-bold px-8 py-6 text-lg rounded-full w-full sm:w-auto backdrop-blur-sm transition-all"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              WhatsApp Direct
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-primary rounded-full" />
        </div>
      </div>
    </section>
  );
}
