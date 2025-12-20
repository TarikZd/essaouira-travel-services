'use client';

import Image from 'next/image';
import { Clock, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const destinations = [
  {
    from: 'Marrakech',
    to: 'Essaouira',
    time: '2h30',
    price: 'A partir de 60€',
    image: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=2070&auto=format&fit=crop'
  },
  {
    from: 'Agadir',
    to: 'Essaouira',
    time: '3h00',
    price: 'A partir de 80€',
    image: 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?q=80&w=2070&auto=format&fit=crop'
  },
  {
    from: 'Casablanca',
    to: 'Essaouira',
    time: '4h30',
    price: 'A partir de 140€',
    image: 'https://images.unsplash.com/photo-1534445656127-6663c9bcea09?q=80&w=2070&auto=format&fit=crop'
  },
  {
    from: 'Aéroport',
    to: 'Centre Ville',
    time: '20 min',
    price: 'A partir de 15€',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop'
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
                <Image
                  src={dest.image}
                  alt={`Transfert ${dest.from} vers ${dest.to} - Transport Touristique Maroc`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-black/80 backdrop-blur text-white px-3 py-1 rounded-full text-xs font-bold flex items-center border border-white/10">
                  <Clock className="w-3 h-3 text-primary mr-1" />
                  {dest.time}
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
