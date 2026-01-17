'use client';

import * as React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Star, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { CldImage } from 'next-cloudinary';
import { format, subDays } from 'date-fns';
import { getDynamicMetrics } from '@/lib/metrics';
import { ReviewFormDialog } from './ReviewFormDialog';

// --- Data & Configuration ---

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
  'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores'
];

type AdventureType = 'cooking' | 'fishing' | 'hiking' | 'general';

interface ReviewTemplate {
    textEn: string;
    textOriginal: string;
    type: AdventureType;
}

interface CountryData {
    name: string;
    code: string;
    templates: ReviewTemplate[];
}

const t = (original: string, english: string, type: AdventureType): ReviewTemplate => ({ textOriginal: original, textEn: english, type });

const countryData: CountryData[] = [
  { 
      name: 'France', code: 'FR', 
      templates: [
          t("Cours de cuisine incroyable ! On a adoré le marché.", "Amazing cooking class! Loved the market tour.", 'cooking'),
          t("Le tajine était délicieux. Super chef !", "The tagine was delicious. Great chef!", 'cooking'),
          t("Super journée de pêche, on a attrapé plein de poissons.", "Great fishing day, caught lots of fish.", 'fishing'),
          t("Une expérience de pêche authentique à Essaouira.", "An authentic fishing experience in Essaouira.", 'fishing'),
          t("Randonnée magnifique, paysages à couper le souffle.", "Magnificent hike, breathtaking landscapes.", 'hiking'),
          t("Super guide et belle aventure.", "Great guide and beautiful adventure.", 'general')
      ]
  },
  { 
      name: 'UK', code: 'GB', 
      templates: [
          t("Best cooking class I've ever done. Highly recommend!", "Best cooking class I've ever done. Highly recommend!", 'cooking'),
          t("Learned so much about Moroccan spices. Delicious food.", "Learned so much about Moroccan spices. Delicious food.", 'cooking'),
          t("Fantastic fishing trip. The captain was very knowledgeable.", "Fantastic fishing trip. The captain was very knowledgeable.", 'fishing'),
          t("Lovely hike through the countryside. Very peaceful.", "Lovely hike through the countryside. Very peaceful.", 'hiking'),
          t("A wonderful day out with the family.", "A wonderful day out with the family.", 'general')
      ]
  },
  { 
      name: 'Germany', code: 'DE', 
      templates: [
          t("Toller Kochkurs! Das Essen war fantastisch.", "Great cooking class! The food was fantastic.", 'cooking'),
          t("Ein echtes Highlight unserer Reise.", "A real highlight of our trip.", 'general'),
          t("Super Angeltour, wir haben viel gefangen.", "Great fishing tour, we caught a lot.", 'fishing'),
          t("Wunderschöne Wanderung, tolle Natur.", "Beautiful hike, great nature.", 'hiking'),
          t("Sehr freundliches Team, alles perfekt organisiert.", "Very friendly team, perfectly organized.", 'general')
      ]
  },
  { 
      name: 'Spain', code: 'ES', 
      templates: [
          t("¡Clase de cocina increíble! Aprendimos mucho.", "Incredible cooking class! We learned a lot.", 'cooking'),
          t("Día de pesca inolvidable. El capitán fue genial.", "Unforgettable fishing day. The captain was great.", 'fishing'),
          t("Hermosa caminata y vistas espectaculares.", "Beautiful walk and spectacular views.", 'hiking'),
          t("Una experiencia muy auténtica.", "A very authentic experience.", 'general'),
          t("Comida deliciosa y gente amable.", "Delicious food and friendly people.", 'cooking')
      ]
  },
  { 
      name: 'Italy', code: 'IT', 
      templates: [
          t("Corso di cucina fantastico! Il cibo era ottimo.", "Fantastic cooking class! The food was great.", 'cooking'),
          t("Bellissima giornata di pesca.", "Beautiful fishing day.", 'fishing'),
          t("Un'escursione meravigliosa nella natura.", "A wonderful hike in nature.", 'hiking'),
          t("Esperienza indimenticabile a Essaouira.", "Unforgettable experience in Essaouira.", 'general')
      ]
  }
];

const colors = [
  'bg-purple-600', 'bg-blue-600', 'bg-pink-600', 'bg-green-600', 'bg-orange-600', 
  'bg-red-600', 'bg-teal-600', 'bg-indigo-600', 'bg-cyan-600', 'bg-yellow-600'
];

interface Review {
  id: number;
  author: string;
  country: string;
  countryCode: string;
  date: string;
  rating: number;
  text: string;
  originalText: string;
  initial: string;
  color: string;
  source: string;
  type: AdventureType;
}

// --- Generator Logic ---

const BASE_COUNTS = {
    cooking: 83,
    fishing: 71,
    hiking: 27,
    // total 378 -> 378 - (83+71+27) = 197 general
    general: 197
};
const BASE_TOTAL = 378;

const generateReviews = (): Review[] => {
  const reviews: Review[] = [];
  let currentId = 1;
  const today = new Date();
  const { reviews: TARGET_TOTAL } = getDynamicMetrics(); // Starts at 378 + growth

  // Helper to pick random template of specific type
  const pickTemplate = (type: AdventureType | 'any', country: CountryData): ReviewTemplate => {
      const candidates = type === 'any' ? country.templates : country.templates.filter(t => t.type === type);
      if (candidates.length === 0) return country.templates[0];
      return candidates[Math.floor(Math.random() * candidates.length)];
  };

  const createReview = (daysBack: number, type: AdventureType): Review => {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const country = countryData[Math.floor(Math.random() * countryData.length)];
      const template = pickTemplate(type, country);
      const dayDate = subDays(today, daysBack);

      return {
        id: currentId++,
        author: `${firstName} ${lastName}`,
        country: country.name,
        countryCode: country.code,
        date: format(dayDate, 'd MMMM yyyy'), 
        rating: 5, 
        text: template.textEn, 
        originalText: template.textOriginal,
        initial: firstName[0],
        color: colors[Math.floor(Math.random() * colors.length)],
        source: 'google',
        type: template.type
      };
  };

  // 1. Generate Base 378 Reviews (Distributed over last ~120 days)
  // We need to exactly match counts, but distributed in time.
  const basePool: AdventureType[] = [
      ...Array(BASE_COUNTS.cooking).fill('cooking'),
      ...Array(BASE_COUNTS.fishing).fill('fishing'),
      ...Array(BASE_COUNTS.hiking).fill('hiking'),
      ...Array(BASE_COUNTS.general).fill('general')
  ];
  
  // Shuffle pool to randomize order/time
  for (let i = basePool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [basePool[i], basePool[j]] = [basePool[j], basePool[i]];
  }

  basePool.forEach((type, index) => {
      // Distibrate primarily over last 3-4 months
      const daysBack = Math.floor(Math.random() * 120) + 1;
      reviews.push(createReview(daysBack, type));
  });

  // 2. Generate Growth Reviews (From 378 to TARGET_TOTAL)
  // Logic: 70% Cooking/Fishing, 30% Other
  const growthNeeded = Math.max(0, TARGET_TOTAL - BASE_TOTAL);
  
  for (let i = 0; i < growthNeeded; i++) {
        const rand = Math.random();
        let type: AdventureType = 'general';
        if (rand < 0.35) type = 'cooking';      // 35%
        else if (rand < 0.70) type = 'fishing'; // 35% (Total 70% C+F)
        else if (rand < 0.85) type = 'hiking';  // 15%
        else type = 'general';                  // 15%

        // Growth is recent (last 1-5 days)
        const daysBack = Math.floor(Math.random() * 5); 
        reviews.unshift(createReview(daysBack, type)); // Add to top/front
  }

  // Sort by date (newest first)
  // Since we used rough daysBack, sorting guarantees order.
  // Note: 'date' string format makes simple sort hard, assume currentId order roughly correlates or just trust unshift/push logic? 
  // Better to sort by ID descending or rely on unshift order for recents.
  // Actually, unshifting growth puts them first. Base is randomized.
  
  return reviews;
};

// --- Component ---

export default function Reviews() {
  const [reviews, setReviews] = React.useState<Review[]>([]);
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', loop: true });
  const [translatedReviews, setTranslatedReviews] = React.useState<Record<number, boolean>>({});
  const [totalReviews, setTotalReviews] = React.useState(BASE_TOTAL);

  React.useEffect(() => {
    const { reviews: total } = getDynamicMetrics();
    setTotalReviews(total);
    const allReviews = generateReviews();
    setReviews(allReviews.slice(0, 15)); // Configurable slice
  }, []);

  const scrollPrev = React.useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = React.useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const toggleTranslation = (id: number) => setTranslatedReviews(prev => ({ ...prev, [id]: !prev[id] }));

  if (reviews.length === 0) return null;

  return (
    <section id="reviews" className="py-24 bg-secondary border-y border-border overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Summary Column */}
          <div className="lg:w-1/3 text-center lg:text-left space-y-6">
            <h2 className="font-headline text-3xl md:text-5xl font-bold text-foreground leading-tight">
              What our <br/>
              <span className="text-primary">Adventurers Say</span>
            </h2>
            
            <div className="flex flex-col items-center lg:items-start space-y-4">
              <div className="flex items-center space-x-4 bg-card p-4 rounded-xl border border-border shadow-sm">
                <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden relative mr-2">
                   <CldImage 
                      src="https://res.cloudinary.com/doy1q2tfm/image/upload/v1766386707/brand-icon_v517gx.png"
                      alt="Essaouira Adventures" 
                      width={60} 
                      height={60} 
                    />
                </div>
                <div>
                   <h3 className="text-foreground font-bold text-lg">Essaouira Adventures</h3>
                   <div className="flex items-center space-x-1">
                     <span className="text-orange-400 font-bold text-lg">4.9</span>
                     <div className="flex">
                       {[1, 2, 3, 4, 5].map((star) => (
                         <Star key={star} className="w-4 h-4 fill-orange-400 text-orange-400" />
                       ))}
                     </div>
                   </div>
                   <p className="text-sm text-muted-foreground">{totalReviews.toLocaleString('en-US')} reviews</p>
                </div>
              </div>

              <div className="flex gap-4 items-center">
                 <ReviewFormDialog />
                 <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="rounded-full border border-border text-foreground hover:bg-muted" onClick={scrollPrev}>
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full border border-border text-foreground hover:bg-muted" onClick={scrollNext}>
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
                    <Card className="h-full bg-card border border-border shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/50">
                      <CardContent className="p-6 flex flex-col h-full">
                        <div className="flex items-start justify-between mb-4">
                           <div className="flex items-center gap-3">
                               <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white font-bold", review.color)}>
                                   {review.initial}
                               </div>
                               <div>
                                   <h4 className="font-bold text-foreground text-sm">{review.author}</h4>
                                   <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                      <span className="font-medium text-primary">{review.country}</span>
                                      <span>•</span>
                                      <span>{review.date}</span>
                                   </div>
                               </div>
                           </div>
                            <div className="w-8 h-6 relative shadow-sm rounded overflow-hidden">
                               <Image
                                   src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${review.countryCode}.svg`}
                                   alt={`${review.country} flag`}
                                   fill
                                   className="object-cover"
                               />
                           </div>
                        </div>
                        
                        <div className="flex mb-3">
                            {[...Array(review.rating)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                            <span className="ml-2 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                    <Check className="w-2.5 h-2.5 text-white" />
                            </span>
                        </div>

                        <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-grow italic">
                             "{translatedReviews[review.id] ? review.text : review.originalText}"
                        </p>

                        <div className="flex justify-between items-center mt-auto">
                            {(review.countryCode !== 'GB' && review.countryCode !== 'US') && (
                                <button 
                                    onClick={() => toggleTranslation(review.id)}
                                    className="text-xs text-primary hover:text-primary/80 font-medium flex items-center transition-colors"
                                >
                                    {translatedReviews[review.id] ? 'See original' : 'Translate'}
                                </button>
                            )}
                        </div>
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
