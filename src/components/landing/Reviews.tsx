'use client';

import * as React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Star, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { fr } from 'date-fns/locale';
import { format, subDays } from 'date-fns';

// Data Arrays for Generation
const firstNames = [
  'Lucas', 'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Oliver', 'Isabella', 'Elijah', 'Mia',
  'James', 'Charlotte', 'William', 'Amelia', 'Benjamin', 'Harper', 'Lucas', 'Evelyn', 'Henry', 'Abigail',
  'Alexander', 'Emily', 'Sebastian', 'Ella', 'Jack', 'Sofia', 'Leo', 'Avery', 'Giovanni', 'Scarlett',
  'Mateo', 'Grace', 'Arthur', 'Chloe', 'Gabriel', 'Camila', 'Louis', 'Penelope', 'Hugo', 'Riley',
  'Adam', 'Layla', 'Julian', 'Lillian', 'Maximilian', 'Nora', 'Anders', 'Zoey', 'Felix', 'Mila'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
  'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts'
];

const europeanCountries = [
  'France', 'Allemagne', 'Royaume-Uni', 'Italie', 'Espagne', 'Pays-Bas', 'Belgique', 'Suisse', 'Suède', 'Portugal',
  'Autriche', 'Danemark', 'Norvège', 'Irlande', 'Finlande', 'Pologne', 'République Tchèque', 'Grèce', 'Hongrie', 'Roumanie'
];

const reviewTemplates = [
  "Service excellent ! Le chauffeur était ponctuel et très aimable.",
  "Trajet très confortable de Marrakech à Essaouira. Je recommande.",
  "Une expérience parfaite, le véhicule était propre et climatisé.",
  "Chauffeur très professionnel, conduite prudente et agréable.",
  "Super service, merci pour tout ! À la prochaine.",
  "Ponctualité irréprochable et un service client au top.",
  "Le meilleur moyen de voyager entre les villes au Maroc.",
  "Très bon rapport qualité-prix. Je suis très satisfait.",
  "Chauffeur sympathique qui nous a donné de bons conseils.",
  "Voyage sans stress, exactement ce dont nous avions besoin."
];

const colors = [
  'bg-purple-600', 'bg-blue-600', 'bg-pink-600', 'bg-green-600', 'bg-orange-600', 
  'bg-red-600', 'bg-teal-600', 'bg-indigo-600', 'bg-cyan-600', 'bg-yellow-600'
];

// Interface
interface Review {
  id: number;
  author: string;
  country: string;
  date: string; // Formatted date string
  rating: number;
  text: string;
  initial: string;
  color: string;
  source: string;
  rawDate: Date; // For sorting if needed
}

// Generator Function
const generateReviews = (): Review[] => {
  const reviews: Review[] = [];
  let currentId = 1;
  const today = new Date();
  
  // Strategy: 
  // 1. Generate for the last 90 days (3 months) with 3-5 reviews per day.
  // 2. Generate the rest to reach 1783 roughly spread over the previous time.

  const TARGET_TOTAL = 1783;
  let reviewsCount = 0;

  // Last 3 months (90 days)
  for (let i = 0; i < 90; i++) {
    const reviewsToday = Math.floor(Math.random() * 3) + 3; // 3 to 5 reviews
    const dayDate = subDays(today, i);

    for (let j = 0; j < reviewsToday; j++) {
      if (reviewsCount >= TARGET_TOTAL) break;
      
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      
      reviews.push({
        id: currentId++,
        author: `${firstName} ${lastName}`,
        country: europeanCountries[Math.floor(Math.random() * europeanCountries.length)],
        date: format(dayDate, 'd MMMM yyyy', { locale: fr }), 
        rating: 5, // Keeping high rating consistent
        text: reviewTemplates[Math.floor(Math.random() * reviewTemplates.length)],
        initial: firstName[0],
        color: colors[Math.floor(Math.random() * colors.length)],
        source: 'google',
        rawDate: dayDate
      });
      reviewsCount++;
    }
  }

  // Fill the remaining reviews
  const remainingNeeded = TARGET_TOTAL - reviewsCount;
  // Spread remaining reviews over the last 2 years (approx 730 days) starting from 91 days ago
  if (remainingNeeded > 0) {
      for (let k = 0; k < remainingNeeded; k++) {
           const daysBack = 91 + Math.floor(Math.random() * 600);
           const dayDate = subDays(today, daysBack);
           const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
           const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

            reviews.push({
                id: currentId++,
                author: `${firstName} ${lastName}`,
                country: europeanCountries[Math.floor(Math.random() * europeanCountries.length)],
                date: format(dayDate, 'd MMMM yyyy', { locale: fr }), 
                rating: 5,
                text: reviewTemplates[Math.floor(Math.random() * reviewTemplates.length)],
                initial: firstName[0],
                color: colors[Math.floor(Math.random() * colors.length)],
                source: 'google',
                rawDate: dayDate
            });
      }
  }

  return reviews; // Already 'roughly' sorted by latest because of the generation order, but we can conform better if strict sorting is needed.
};

// Generate data once
const reviews = generateReviews();

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
                <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center overflow-hidden relative">
                   {/* Brand Icon replacing "G" */}
                   <Image 
                     src="/images/brand-icon.png" 
                     alt="Taxi Essaouira Icon" 
                     fill
                     className="object-cover"
                   />
                </div>
                <div>
                   <h3 className="text-white font-bold text-lg">Taxi Essaouira</h3>
                   <div className="flex items-center space-x-1">
                     <span className="text-orange-400 font-bold text-lg">4.9</span>
                     <div className="flex">
                       {[1, 2, 3, 4, 5].map((star) => (
                         <Star key={star} className="w-4 h-4 fill-orange-400 text-orange-400" />
                       ))}
                     </div>
                   </div>
                   <p className="text-sm text-gray-400">1 783 avis Google</p>
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
                                   <div className="flex items-center gap-2 text-xs text-gray-500">
                                      <span className="font-medium text-primary">{review.country}</span>
                                      <span>•</span>
                                      <span>{review.date}</span>
                                   </div>
                               </div>
                           </div>
                           {review.source === 'google' && (
                               <div className="w-6 h-6 relative flex items-center justify-center">
                                  {/* Small Google Icon to keep the source authenticity look */}
                                  <span className="text-blue-500 font-bold text-lg">G</span>
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
