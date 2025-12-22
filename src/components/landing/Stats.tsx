'use client';

import { useEffect, useState } from 'react';
import { Users, Calendar, Clock, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

// Hook removed: useCounter (unused)
// Component removed: AnimatedStat (unused)

import { getDynamicMetrics } from '@/lib/metrics';

// ... imports remain the same

export default function Stats() {
  const [metrics, setMetrics] = useState({ trips: 7438 });

  useEffect(() => {
     const { trips } = getDynamicMetrics();
     setMetrics({ trips });
  }, []);

  const stats = [
    { 
      label: 'Déplacements Réalisés', 
      value: metrics.trips, 
      start: 3651,
      suffix: '+', 
      icon: Users,
      isAnimated: false 
    },
    { 
      label: "Années d'expérience", 
      value: 5, 
      start: 0,
      suffix: '', 
      icon: Calendar,
      isAnimated: false 
    },
    { 
      label: 'Service disponible', 
      value: '24/7', 
      icon: Clock,
      isAnimated: false
    },
    { 
      label: 'Note Des Clients', 
      value: 4.9, 
      start: 0,
      suffix: '', 
      icon: Star,
      isAnimated: false 
    },
  ];

  return (
    <section className="py-20 bg-card border-y border-white/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, idx) => (
            <div key={`${stat.label}-${idx}`} className="flex flex-col items-center text-center group">
              <div className="mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                <stat.icon className="w-6 h-6 text-primary group-hover:text-black transition-colors duration-300" />
              </div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight group-hover:text-primary transition-colors">
                  <span>{stat.value}{stat.suffix}</span>
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
