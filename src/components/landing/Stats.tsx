'use client';

import { useEffect, useState, useRef } from 'react';
import { Users, Calendar, Clock, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

// Hook for counting animation
const useCounter = (end: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      // Ease out quart
      const ease = 1 - Math.pow(1 - percentage, 4);
      
      setCount(Math.min(end, Math.floor(end * ease)));

      if (progress < duration) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCount(end); // Ensure exact final value
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [end, duration, isVisible]);

  return { count, countRef };
};

const AnimatedStat = ({ value, suffix = '', className }: { value: number, suffix?: string, className?: string }) => {
  // Check if it's a float (like 4.9)
  const isFloat = value % 1 !== 0;
  // Multiply by 10 for float animation handling if needed, or just animate the integer part?
  // Use a specialized approach for floats if needed, but for 4.9 simple approach might look jumpy.
  // Let's stick to simple counter and format at the end.
  
  const { count, countRef } = useCounter(isFloat ? value * 10 : value, 2000);
  
  const displayValue = isFloat ? (count / 10).toFixed(1) : count;

  return (
    <span ref={countRef} className={className}>
      {displayValue}{suffix}
    </span>
  );
};

const stats = [
  { 
    label: 'Déplacements Réalisés', 
    value: 7962, 
    suffix: '+', 
    icon: Users,
    isAnimated: true 
  },
  { 
    label: "Années d'expérience", 
    value: 5, 
    suffix: '', 
    icon: Calendar,
    isAnimated: true 
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
    suffix: '', 
    icon: Star,
    isAnimated: true 
  },
];

export default function Stats() {
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
                {stat.isAnimated && typeof stat.value === 'number' ? (
                  <AnimatedStat value={stat.value} suffix={stat.suffix} />
                ) : (
                  <span>{stat.value}</span>
                )}
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
