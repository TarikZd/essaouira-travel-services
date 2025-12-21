'use client';

import * as React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Star, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { fr } from 'date-fns/locale';
import { format, subDays } from 'date-fns';
import { ReviewFormDialog } from '@/components/reviews/ReviewFormDialog';

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

interface ReviewTemplate {
    textFr: string;
    textOriginal: string;
}

interface CountryData {
    name: string;
    code: string;
    templates: ReviewTemplate[];
}

// Helper to create templates easily
const t = (original: string, french: string) => ({ textOriginal: original, textFr: french });

const countryData: CountryData[] = [
  { 
      name: 'France', code: 'FR', 
      templates: [
          t("Service excellent ! Le chauffeur était ponctuel.", "Service excellent ! Le chauffeur était ponctuel."),
          t("Trajet très confortable de Marrakech à Essaouira.", "Trajet très confortable de Marrakech à Essaouira."),
          t("Une expérience parfaite, le véhicule était propre.", "Une expérience parfaite, le véhicule était propre."),
          t("Chauffeur très professionnel et agréable.", "Chauffeur très professionnel et agréable."),
          t("Super service, merci pour tout !", "Super service, merci pour tout !")
      ]
  },
  { 
      name: 'Allemagne', code: 'DE', 
      templates: [
          t("Ausgezeichneter Service! Der Fahrer war sehr pünktlich.", "Service excellent ! Le chauffeur était très ponctuel."),
          t("Sehr angenehme Fahrt von Marrakesch nach Essaouira.", "Trajet très agréable de Marrakech à Essaouira."),
          t("Perfekte Erfahrung, das Auto war sauber und klimatisiert.", "Expérience parfaite, la voiture était propre et climatisée."),
          t("Sehr professioneller Fahrer, sichere Fahrweise.", "Chauffeur très professionnel, conduite sûre."),
          t("Toller Service, danke für alles!", "Super service, merci pour tout !")
      ]
  },
  { 
      name: 'Royaume-Uni', code: 'GB', 
      templates: [
          t("Excellent service! The driver was punctual and friendly.", "Service excellent ! Le chauffeur était ponctuel et amical."),
          t("Very comfortable trip from Marrakech to Essaouira.", "Trajet très confortable de Marrakech à Essaouira."),
          t("A perfect experience, the vehicle was clean and AC was good.", "Une expérience parfaite, le véhicule était propre et la clim bonne."),
          t("Very professional driver, felt very safe.", "Chauffeur très professionnel, je me suis senti très en sécurité."),
          t("Great service, thanks for everything!", "Super service, merci pour tout !")
      ]
  },
  { 
      name: 'Italie', code: 'IT', 
      templates: [
          t("Servizio eccellente! L'autista è stato puntuale.", "Service excellent ! Le chauffeur a été ponctuel."),
          t("Viaggio molto confortevole da Marrakech a Essaouira.", "Voyage très confortable de Marrakech à Essaouira."),
          t("Esperienza perfetta, veicolo pulito.", "Expérience parfaite, véhicule propre."),
          t("Autista molto professionale, guida sicura.", "Chauffeur très professionnel, conduite sûre."),
          t("Ottimo servizio, grazie di tutto!", "Excellent service, merci pour tout !")
      ]
  },
  { 
      name: 'Espagne', code: 'ES', 
      templates: [
          t("¡Excelente servicio! El conductor fue puntual.", "Excellent service ! Le conducteur était ponctuel."),
          t("Viaje muy cómodo de Marrakech a Essaouira.", "Voyage très confortable de Marrakech à Essaouira."),
          t("Una experiencia perfecta, el coche estaba limpio.", "Une expérience parfaite, la voiture était propre."),
          t("Conductor muy profesional, conducción suave.", "Conducteur très professionnel, conduite douce."),
          t("¡Gran servicio, gracias por todo!", "Grand service, merci pour tout !")
      ]
  },
  { 
      name: 'Pays-Bas', code: 'NL', 
      templates: [
          t("Uitstekende service! De chauffeur was op tijd.", "Service excellent ! Le chauffeur était à l'heure."),
          t("Zeer comfortabele reis van Marrakech naar Essaouira.", "Voyage très confortable de Marrakech à Essaouira."),
          t("Perfecte ervaring, schone auto.", "Expérience parfaite, voiture propre."),
          t("Zeer professionele chauffeur.", "Chauffeur très professionnel."),
          t("Geweldige service, bedankt!", "Super service, merci !")
      ]
  },
  { 
      name: 'Belgique', code: 'BE', 
      templates: [
          t("Service excellent ! (Service uitstekend!)", "Service excellent !"), 
          t("Trajet impeccable.", "Trajet impeccable."),
          t("Chauffeur très sympa.", "Chauffeur très sympa."),
          t("A recommander vivement.", "A recommander vivement.")
      ]
  },
    { 
      name: 'Suisse', code: 'CH', 
      templates: [
          t("Service excellent / Ausgezeichneter Service.", "Service excellent."),
          t("Fahrt war super. / Le trajet était super.", "Le trajet était super."),
          t("Sichere Fahrt. / Conduite sûre.", "Conduite sûre.")
      ]
  },
  { 
      name: 'Portugal', code: 'PT', 
      templates: [
           t("Serviço excelente! O motorista foi pontual.", "Service excellent ! Le chauffeur était ponctuel."),
           t("Viagem muito confortável.", "Voyage très confortable."),
           t("Muito obrigado pelo serviço.", "Merci beaucoup pour le service.")
      ]
  }
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
  countryCode: string;
  date: string; // Formatted date string
  rating: number;
  text: string; // French translation
  originalText: string; // Original Language
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
  const TARGET_TOTAL = 1783;
  let reviewsCount = 0;

  const generateData = (daysBackStart: number, daysBackEnd: number, countPerDay: number, totalLimit: number) => {
       for (let i = daysBackStart; i < daysBackEnd; i++) {
        const reviewsToday = countPerDay === -1 ? 1 : Math.floor(Math.random() * 3) + 3;
        const dayDate = subDays(today, i);
    
        for (let j = 0; j < reviewsToday; j++) {
            if (reviewsCount >= totalLimit) break;
            
            const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
            const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
            const country = countryData[Math.floor(Math.random() * countryData.length)];
            
            // Pick a random template for this country
            const template = country.templates[Math.floor(Math.random() * country.templates.length)];

            reviews.push({
                id: currentId++,
                author: `${firstName} ${lastName}`,
                country: country.name,
                countryCode: country.code,
                date: format(dayDate, 'd MMMM yyyy', { locale: fr }), 
                rating: 5, 
                text: template.textFr, 
                originalText: template.textOriginal,
                initial: firstName[0],
                color: colors[Math.floor(Math.random() * colors.length)],
                source: 'google',
                rawDate: dayDate
            });
            reviewsCount++;
        }
      }
  }

  // Last 90 days
  generateData(0, 90, 3, TARGET_TOTAL);

  // Remaining history
  const remainingNeeded = TARGET_TOTAL - reviewsCount;
  if (remainingNeeded > 0) {
      // Loop simply to fill up
      for(let k=0; k< remainingNeeded; k++) {
         const daysBack = 91 + Math.floor(Math.random() * 600);
         const dayDate = subDays(today, daysBack);
         const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
         const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
         const country = countryData[Math.floor(Math.random() * countryData.length)];
         const template = country.templates[Math.floor(Math.random() * country.templates.length)];

         reviews.push({
                id: currentId++,
                author: `${firstName} ${lastName}`,
                country: country.name,
                countryCode: country.code,
                date: format(dayDate, 'd MMMM yyyy', { locale: fr }), 
                rating: 5, 
                text: template.textFr,
                originalText: template.textOriginal,
                initial: firstName[0],
                color: colors[Math.floor(Math.random() * colors.length)],
                source: 'google',
                rawDate: dayDate
         });
         reviewsCount++;
      }
  }

  return reviews; 
};

export default function Reviews() {
  const [reviews, setReviews] = React.useState<Review[]>([]);
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', loop: true });
  // State to track which reviews are translated
  const [translatedReviews, setTranslatedReviews] = React.useState<Record<number, boolean>>({});

  React.useEffect(() => {
    setReviews(generateReviews());
  }, []);

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const toggleTranslation = (id: number) => {
    setTranslatedReviews(prev => ({
        ...prev,
        [id]: !prev[id]
    }));
  };

  if (reviews.length === 0) {
      return null; 
  }

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
                   <p className="text-sm text-gray-400">1 783 avis</p>
                </div>
              </div>

              <div className="flex gap-4">
                <ReviewFormDialog>
                    <Button 
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10 hover:text-white rounded-full px-6"
                    >
                        Écrire un avis
                    </Button>
                </ReviewFormDialog>
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
                    <Card className="h-full bg-[#0b0f19] border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/50">
                      <CardContent className="p-6 flex flex-col h-full">
                        <div className="flex items-start justify-between mb-4">
                           <div className="flex items-center gap-3">
                               <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white font-bold", review.color)}>
                                   {review.initial}
                               </div>
                               <div>
                                   <h4 className="font-bold text-white text-sm">{review.author}</h4>
                                   <div className="flex items-center gap-2 text-xs text-gray-400">
                                      <span className="font-medium text-primary">{review.country}</span>
                                      <span>•</span>
                                      <span>{review.date}</span>
                                   </div>
                               </div>
                           </div>
                           {/* Flag Icon Replacement */}
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

                        <p className="text-gray-300 text-sm leading-relaxed mb-4 flex-grow italic">
                             "{translatedReviews[review.id] ? review.text : review.originalText}"
                        </p>

                        <div className="flex justify-between items-center mt-auto">
                            {(review.countryCode !== 'FR' && review.countryCode !== 'BE') && (
                                <button 
                                    onClick={() => toggleTranslation(review.id)}
                                    className="text-xs text-primary hover:text-primary/80 font-medium flex items-center transition-colors"
                                >
                                    {translatedReviews[review.id] ? 'Voir l\'original' : 'Traduire'}
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
