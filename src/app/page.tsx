'use client';

import { useState } from 'react';
import { services, type Service } from '@/lib/services';
import Hero from '@/components/landing/Hero';
import Stats from '@/components/landing/Stats';
import Reviews from '@/components/landing/Reviews';
import Destinations from '@/components/landing/Destinations';
import ServiceCard from '@/components/services/ServiceCard';
import BookingForm from '@/components/services/BookingForm';
import RecommendationEngine from '@/components/ai/RecommendationEngine';
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
                                <h4 className="font-bold">Service 24/7</h4>
                                <p className="text-gray-500">Disponible jour et nuit</p>
                            </div>
                        </div>
                         <div className="flex items-center space-x-4 text-white">
                            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                                <MapPin className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h4 className="font-bold">Couverture Nationale</h4>
                                <p className="text-gray-500">Marrakech, Essaouira, Agadir, etc.</p>
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
                        <div className="flex justify-center items-center gap-4 flex-wrap opacity-70 grayscale hover:grayscale-0 transition-all duration-300">
                             {/* Visa */}
                             <svg className="h-8 w-auto text-white" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M48 0H0V48H48V0Z" fill="rgba(255,255,255,0)"/><path d="M19.1643 31.7828L22.6186 10.6621H16.89L13.4357 26.9818C13.0643 28.5303 12.8786 29.0258 11.2071 29.9545C9.72143 30.7591 7.49286 31.5023 5.38714 31.6262L5.13929 32.7411H14.1486C16.1293 32.7411 16.4386 32.5553 16.81 30.3888M37.7814 20.2185C37.8429 20.0326 37.9671 18.2985 36.6043 16.7499C35.2421 15.2013 32.7643 14.8916 30.5979 15.5729C28.43 16.2541 27.8729 17.6787 27.6871 18.2361M39.02 9.05176L41.31 9.05176C43.23 9.05176 43.4158 9.23762 43.5393 10.0428L47.01 26.4253L41.8058 26.4253L40.6286 20.7253C40.6286 20.7253 38.8329 18.6814 36.9136 18.0621C35.8607 17.6905 34.6836 17.8143 34.1886 19.3008C33.8786 20.2299 34.56 20.2299 36.1707 21.035C38.3371 22.088 38.7707 23.3267 38.6471 25.1245C38.2758 28.3438 31.4029 34.3516 27.7486 31.9976C25.3943 30.5111 25.0843 27.3528 26.1371 23.5126C27.5614 18.3392 31.3414 12.8919 36.6664 12.8919C37.9671 12.8919 39.02 12.8919 39.02 9.05176ZM28.9879 10.6621L24.8993 31.9069L20.5014 31.9069L24.59 10.6621L28.9879 10.6621ZM15.4486 9.05176L8.88286 24.3638L9.13071 24.4876C10.7407 23.4966 12.2893 22.5676 13.9 9.05176H15.4486ZM33.0114 31.9069L34.1264 26.3316L34.25 26.3316L34.25 31.9069H33.0114Z" fill="white"/></svg>

                             {/* Mastercard */}
                             <svg className="h-8 w-auto text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.6667 8.08008H10.5333V5.53341C10.5333 4.28674 11.5467 3.26675 12.8 3.26675H14.1867V8.08008H11.6667Z" fill="white"/><path d="M12.8 13.0667C11.36 13.0667 10.0267 13.56 8.97333 14.3734C7.94667 13.2934 7.33333 11.8267 7.33333 10.2134C7.33333 8.37341 8.24 6.74675 9.64 5.66675C10.5467 6.66675 11.6267 7.74675 12.8 9.30675C13.9733 7.74675 15.0533 6.66675 15.96 5.66675C17.36 6.74675 18.2667 8.37341 18.2667 10.2134C18.2667 11.8267 17.6533 13.2934 16.6267 14.3734C15.5733 13.56 14.24 13.0667 12.8 13.0667Z" fill="#FF5F00"/><path d="M9.64 14.7601C8.24 13.6801 7.33333 12.0534 7.33333 10.2134C7.33333 8.60008 7.94667 7.13341 8.97333 6.05341C7.94667 6.86675 6.61333 7.36008 5.17333 7.36008C2.86667 7.36008 1 9.22675 1 11.5334V18.3334C1 20.6401 2.86667 22.5067 5.17333 22.5067H8.56V18.8267H6.77333C6.34667 18.8267 6 18.4801 6 18.0534C6 17.6267 6.34667 17.2801 6.77333 17.2801H9.86667L9.64 14.7601Z" fill="#EB001B"/><path d="M15.96 14.7601L15.7333 17.2801H18.8267C19.2533 17.2801 19.6 17.6267 19.6 18.0534C19.6 18.4801 19.2533 18.8267 18.8267 18.8267H17.04V22.5067H20.4267C22.7333 22.5067 24.6 20.6401 24.6 18.3334V11.5334C24.6 9.22675 22.7333 7.36008 20.4267 7.36008C18.9867 7.36008 17.6533 6.86675 16.6267 6.05341C17.6533 7.13341 18.2667 8.60008 18.2667 10.2134C18.2667 12.0534 17.36 13.6801 15.96 14.7601Z" fill="#F79E1B"/></svg>

                             {/* PayPal */}
                             <svg className="h-6 w-auto text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.06 8.52832C20.42 7.17832 20.31 5.96832 19.58 4.98832C18.57 3.63832 16.66 2.99832 14.16 2.99832H6.94002C6.44002 2.99832 6.01002 3.35832 5.93002 3.84832L3.58002 18.7883C3.52002 19.1483 3.80002 19.4683 4.16002 19.4683H8.39002L9.22002 14.2283H9.23002L9.13002 14.8383L9.67002 11.4183C9.75002 10.9283 10.18 10.5683 10.68 10.5683H12.98C15.97 10.5683 18.33 10.1183 19.46 8.44832C19.74 8.04832 20.06 8.52832 20.06 8.52832Z" fill="white" fillOpacity="0.8"/><path d="M17.76 9.24832C17.49 10.8883 16.29 12.0683 13.79 12.0683H10.69C10.19 12.0683 9.76002 12.4283 9.68002 12.9183L8.34002 21.4683C8.29002 21.7883 8.53002 22.0683 8.86002 22.0683H13.04C13.44 22.0683 13.79 21.7783 13.85 21.3783L14.39 17.9783L14.41 17.8283C14.48 17.4283 14.82 17.1383 15.22 17.1383H15.65C18.64 17.1383 21 15.9283 21.36 12.4283C21.46 11.3383 21.16 10.4283 20.61 9.77832C20.02 9.07832 19.04 8.83832 17.76 9.24832Z" fill="white"/></svg>

                             {/* Apple Pay */}
                             <svg className="h-8 w-auto text-white" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.1867 10.9167C10.1467 9.05 11.6667 8.05333 11.75 8C10.6667 6.42333 8.99 6.22333 8.36667 6.19667C6.96333 6.05333 5.61333 7.02333 4.90333 7.02333C4.19333 7.02333 3.09 6.21667 1.93333 6.24333C0.423333 6.26667 -1.2 7.15667 -1.97 9.58C-3.53667 12.2967 -2.34333 16.3267 -0.816667 18.5333C1.56333 21.9667 2.92667 21.9067 4.5 21.9067C6.01333 21.9067 6.47 20.9367 8.35667 20.9367C10.2167 20.9367 10.62 21.9067 12.2233 21.88C13.8833 21.8533 14.94 19.68 15.6867 18.5867C16.5667 17.3 16.9267 16.05 16.94 15.98C16.9167 15.9667 14.47 15.03 14.53 12.2233C14.59 9.39 16.9233 8.01667 17 8C16.9833 7.95 15.2867 1.76667 10.1867 10.9167ZM11.14 4.09333C11.85 3.23333 12.33 2.04 12.1967 0.863333C11.1633 0.906667 9.91333 1.55333 9.17667 2.41C8.51333 3.17667 7.93667 4.38333 8.09333 5.54667C9.25 5.63667 10.43 4.95333 11.14 4.09333Z" fill="white"/></svg>

                             {/* Google Pay */}
                             <svg className="h-10 w-auto text-white" viewBox="0 0 64 26" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.126 11.1396V20.1876H7.3196V11.1396H10.126ZM10.126 8.3756C10.126 9.1556 9.4938 9.7876 8.7138 9.7876C7.9338 9.7876 7.3016 9.1556 7.3016 8.3756C7.3016 7.5956 7.9338 6.9636 8.7138 6.9636C9.4938 6.9636 10.126 7.5956 10.126 8.3756ZM50.3116 11.1396V20.1876H47.5052V11.1396H50.3116ZM50.3116 8.3756C50.3116 9.1556 49.6794 9.7876 48.8994 9.7876C48.1194 9.7876 47.4872 9.1556 47.4872 8.3756C47.4872 7.5956 48.1194 6.9636 48.8994 6.9636C49.6794 6.9636 50.3116 7.5956 50.3116 8.3756ZM52.9238 20.1876H55.676V11.1396H52.9238V20.1876ZM63.0218 13.5616C61.4278 13.5616 60.1016 14.3316 59.4316 15.6036L59.3876 15.6036L59.0896 13.7936H56.5916V20.1876H59.3436V16.6576C59.3436 15.7096 60.0358 15.1156 60.8578 15.1156C61.3556 15.1156 61.6496 15.2236 61.8016 15.2896L62.7718 12.6336C62.7718 12.6336 63.0218 13.5616 63.0218 13.5616ZM34.0536 20.3096C32.1816 20.3096 30.6876 19.3476 29.8976 17.8976L29.8516 17.8976V20.1876H27.1856V6.7576H29.9376V13.5796L29.8936 13.5796C30.6876 12.1296 32.1816 11.1676 34.0536 11.1676C37.0736 11.1676 39.5116 13.5016 39.5116 16.7376C39.5116 19.9756 37.0736 20.3096 34.0536 20.3096ZM33.2676 13.4356C31.5456 13.4356 30.1476 14.7936 30.1476 16.6336C30.1476 18.5836 31.6536 19.9756 33.3976 19.9756C35.1196 19.9756 36.5176 18.6176 36.5176 16.7776C36.5176 14.8276 35.0116 13.4356 33.2676 13.4356ZM43.4116 20.1876H46.1636V11.1396H43.4116V20.1876ZM43.4116 8.3756C43.4116 9.1556 42.7794 9.7876 41.9994 9.7876C41.2194 9.7876 40.5872 9.1556 40.5872 8.3756C40.5872 7.5956 41.2194 6.9636 41.9994 6.9636C42.7794 6.9636 43.4116 7.5956 43.4116 8.3756ZM5.28941 15.6036L4.01741 12.1296H1.10741L3.94541 18.8876L1.31941 24.6416H4.25741L8.33141 15.6036H5.28941Z" fill="white"/></svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
}

    