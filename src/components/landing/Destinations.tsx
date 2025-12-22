'use client';

import { CldImage } from 'next-cloudinary';
import { Clock, MapPin, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const destinations = [
  {
    from: 'Marrakech',
    to: 'Essaouira',
    time: '2h30',
    price: 'A partir de 60€',
    image: 'https://res.cloudinary.com/doy1q2tfm/image/upload/v1766384357/marrakech-transfer_ldfscm.jpg',
    rating: 4.9,
    reviews: 724
  },
  {
    from: 'Agadir',
    to: 'Essaouira',
    time: '3h00',
    price: 'A partir de 80€',
    image: 'https://res.cloudinary.com/doy1q2tfm/image/upload/v1766386707/agadir-transfer_g5qmde.jpg',
    rating: 4.8,
    reviews: 589
  },
  {
    from: 'Casablanca',
    to: 'Essaouira',
    time: '4h30',
    price: 'A partir de 140€',
    image: 'https://res.cloudinary.com/doy1q2tfm/image/upload/v1766386707/casablanca-transfer_bmqnmf.jpg',
    rating: 5.0,
    reviews: 345
  },
  {
    from: 'Aéroport',
    to: 'Centre Ville',
    time: '20 min',
    price: 'A partir de 15€',
    image: 'https://res.cloudinary.com/doy1q2tfm/image/upload/v1766386709/transport-aeroport-confort_kqh0y5.jpg',
    rating: 4.9,
    reviews: 1215
  }
];

export default function Destinations() {
  return (
    <section id="destinations" className="py-24 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold font-headline text-white mb-4">
            Destinations <span className="text-primary">Populaires</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Découvrez nos trajets les plus demandés avec des temps de parcours optimisés et un confort absolu.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((dest, idx) => (
            <Card 
              key={`${dest.from}-${idx}`} 
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="group overflow-hidden bg-white/5 border-white/10 hover:border-primary/50 transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5"
            >
              <div className="relative h-64 overflow-hidden">
                <CldImage
                  src={dest.image}
                  alt={`Transfert ${dest.from} vers ${dest.to} - Transport Touristique Maroc`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-black/80 backdrop-blur text-white px-3 py-1 rounded-full text-xs font-bold flex items-center border border-white/10">
                  <Clock className="w-3 h-3 text-primary mr-1" />
                  {dest.time}
                </div>
                <div className="absolute top-4 left-4 bg-black/80 backdrop-blur text-white px-3 py-1 rounded-full text-xs font-bold flex items-center border border-white/10">
                  <Star className="w-3 h-3 text-primary fill-primary mr-1" />
                  {dest.rating}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center text-primary text-sm font-semibold mb-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    Trajet Direct
                  </div>
                  <h3 className="text-xl font-bold text-white leading-tight">
                    {dest.from} <span className="text-gray-400">↔</span> {dest.to}
                  </h3>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
