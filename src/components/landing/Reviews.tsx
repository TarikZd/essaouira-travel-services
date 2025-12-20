'use client';

import * as React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Star, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const reviews = [
  {
    id: 1,
    author: 'Jonathan',
    date: 'il y a 1 mois',
    rating: 5,
    text: "Great services. Very responding and arranging. I had a flight at 8h. He picked me up at 6.00 am while I only booked the night before. The car was clean and comfortable. Driver friendly. I recommend 100%.",
    initial: 'J',
    color: 'bg-purple-600',
    source: 'google'
  },
  {
    id: 2,
    author: 'Nicolas',
    date: 'il y a 1 mois',
    rating: 5,
    text: "Merci à la compagnie Moroccan Taxi Driver pour leur prise en charge tout au long de notre séjour au Maroc et à Anass pour sa coordination. Nous avons utilisé vos services pour nos déplacements ville- aéroport / inter-villes dans tout le pays. Très grande qualité professionnelle, services fiables à prix juste.",
    initial: 'N',
    color: 'bg-blue-600',
    source: 'google'
  },
  {
    id: 3,
    author: 'Thibault BECKAERT',
    date: 'il y a 1 mois',
    rating: 5,
    text: "Très bonne prestation pour passer une journée à Agafay avec un chauffeur dédié pour la journée qui s'est adapté à notre rythme. Le véhicule était très confortable (van Mercedes). Je recommande vivement pour le sérieux et la qualité du service.",
    initial: 'T',
    color: 'bg-pink-600',
    source: 'google'
  },
  {
    id: 4,
    author: 'Sarah M.',
    date: 'il y a 2 mois',
    rating: 5,
    text: "Une expérience inoubliable ! Le chauffeur était ponctuel, poli et conduisait très prudemment. Le trajet de Marrakech à Essaouira s'est déroulé à merveille. Merci pour ce service de qualité.",
    initial: 'S',
    color: 'bg-green-600',
    source: 'google'
  },
  {
    id: 5,
    author: 'Mohamed A.',
    date: 'il y a 3 semaines',
    rating: 5,
    text: "Service au top ! Ponctualité irréprochable et véhicules très propres. Le meilleur moyen de voyager entre les villes au Maroc sans stress. Je ferais appel à vous pour mon prochain voyage.",
    initial: 'M',
    color: 'bg-orange-600',
    source: 'google'
  }
];

export default function Reviews() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', loop: true });

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section id="reviews" className="py-24 bg-white/5 border-y border-white/10 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          
          {/* Summary Column */}
          <div className="lg:w-1/3 text-center lg:text-left space-y-6">
            <h2 className="font-headline text-3xl md:text-5xl font-bold text-white leading-tight">
              Ce que disent <br/>
              <span className="text-primary">nos clients</span>
            </h2>
            
            <div className="flex flex-col items-center lg:items-start space-y-4">
              <div className="flex items-center space-x-4 bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
                <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center">
                   {/* Placeholder for business logo or Google G icon */}
                   <span className="text-3xl font-bold text-white">G</span>
                </div>
                <div>
                   <h3 className="text-white font-bold text-lg">Taxi Essaouira</h3>
                   <div className="flex items-center space-x-1">
                     <span className="text-orange-400 font-bold text-lg">5.0</span>
                     <div className="flex">
                       {[1, 2, 3, 4, 5].map((star) => (
                         <Star key={star} className="w-4 h-4 fill-orange-400 text-orange-400" />
                       ))}
                     </div>
                   </div>
                   <p className="text-sm text-gray-400">155 avis Google</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10 hover:text-white rounded-full px-6"
                    onClick={() => window.open('https://g.page/r/YOUR_GOOGLE_REVIEW_LINK', '_blank')}
                >
                    Écrire un avis
                </Button>
                 {/* Navigation Buttons for Mobile/Desktop */}
                 <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full border border-white/20 text-white hover:bg-white/10"
                        onClick={scrollPrev}
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full border border-white/20 text-white hover:bg-white/10"
                        onClick={scrollNext}
                    >
                        <ChevronRight className="w-5 h-5" />
                    </Button>
                 </div>
              </div>
            </div>
          </div>

          {/* Carousel Column */}
          <div className="lg:w-2/3 w-full min-w-0">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex -ml-4 touch-pan-y">
                {reviews.map((review) => (
                  <div className="flex-[0_0_100%] md:flex-[0_0_50%] pl-4 min-w-0" key={review.id}>
                    <Card className="h-full bg-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <CardContent className="p-6 flex flex-col h-full">
                        <div className="flex items-start justify-between mb-4">
                           <div className="flex items-center gap-3">
                               <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white font-bold", review.color)}>
                                   {review.initial}
                               </div>
                               <div>
                                   <h4 className="font-bold text-gray-900 text-sm">{review.author}</h4>
                                   <p className="text-xs text-gray-500">{review.date}</p>
                               </div>
                           </div>
                           {review.source === 'google' && (
                               <div className="w-6 h-6 relative">
                                  {/* Using a text G for Google logo representation to avoid heavy asset */}
                                  <span className="text-blue-500 font-bold text-xl">G</span>
                               </div>
                           )}
                        </div>
                        
                        <div className="flex mb-3">
                            {[...Array(review.rating)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                            {review.source === 'google' && (
                                <span className="ml-2 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>
                                </span>
                            )}
                        </div>

                        <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
                             {review.text.length > 150 ? `${review.text.substring(0, 150)}...` : review.text}
                        </p>

                        <button className="text-left text-sm text-gray-400 font-medium hover:text-gray-600 transition-colors">
                            Lire la suite
                        </button>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
