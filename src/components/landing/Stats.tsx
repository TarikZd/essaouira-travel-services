'use client';

import { Users, Calendar, Clock, Star } from 'lucide-react';

const stats = [
  { label: 'Clients satisfaits', value: '500+', icon: Users },
  { label: "Années d'expérience", value: '5', icon: Calendar },
  { label: 'Service disponible', value: '24/7', icon: Clock },
  { label: 'Satisfaction client', value: '100%', icon: Star },
];

export default function Stats() {
  return (
    <section className="py-20 bg-card border-y border-white/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center text-center group">
              <div className="mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                <stat.icon className="w-6 h-6 text-primary group-hover:text-black transition-colors duration-300" />
              </div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight group-hover:text-primary transition-colors">
                {stat.value}
              </div>
              <div className="text-sm md:text-base text-gray-400 font-medium uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
