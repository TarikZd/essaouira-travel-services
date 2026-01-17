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
    window.open('https://wa.me/212628438838', '_blank');
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
      <div className="relative z-10 container mx-auto px-4 text-center mt-12">
        <div className="space-y-8 animate-in fade-in zoom-in duration-700">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-white mb-4">
            <span className="flex gap-1 text-accent">★★★★★</span>
            <span className="text-sm font-medium">Trusted by 500+ Travelers</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold font-headline text-white tracking-tight leading-tight">
            Essaouira : <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-primary">More than just a ride.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto font-light leading-relaxed">
            Your Authentic Moroccan Experience. <br/>
            <span className="text-white font-medium">Pastry Classes • Cooking Classes • Adventures</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Button 
                onClick={scrollToContact}
                size="lg" 
                className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold px-8 py-7 text-lg rounded-full w-full sm:w-auto shadow-[0_0_20px_rgba(250,204,21,0.3)] transition-all hover:scale-105"
            >
              Book Your Adventure
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
                onClick={openWhatsApp}
                variant="outline" 
                size="lg" 
                className="bg-white/5 text-white border-white/20 hover:bg-white/10 font-medium px-8 py-7 text-lg rounded-full w-full sm:w-auto backdrop-blur-sm transition-all"
            >
              <MessageCircle className="mr-2 h-5 w-5 text-primary" />
              Call Us On WhatsApp
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
