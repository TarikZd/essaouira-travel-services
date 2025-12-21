
'use client';

import { useState, useTransition, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Wand2, ArrowRight } from 'lucide-react';

import { Service, services } from '@/lib/services';
import Link from 'next/link';

interface RecommendationEngineProps {
  onBook?: (slug: string) => void;
}

export default function RecommendationEngine({ onBook }: RecommendationEngineProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [recommendations, setRecommendations] = useState<Service[]>([]);
  const [reasoning, setReasoning] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  // Browsing history can remain even if unused for now in OnePage
  const [browsingHistory] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setRecommendations([]);
    setReasoning('');

    startTransition(async () => {
      try {
        const response = await fetch('/api/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ searchQuery, browsingHistory }),
        });
        
        const result = await response.json();

        if (!response.ok) {
           setError(result.error || 'Something went wrong');
        } else {
           setRecommendations(result.recommendedServices);
           setReasoning(result.reasoning);
        }
      } catch (err) {
         setError('Failed to connect to the server.');
      }
    });
  };

  const handleBookClick = (slug: string) => {
    if (onBook) {
        onBook(slug);
    } else {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Ex: 'Une journée relaxante à la plage' ou 'Aventure 4x4'"
          className="flex-grow text-base bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-14 rounded-xl"
        />
        <Button type="submit" disabled={isPending} className="bg-primary text-black hover:bg-yellow-500 font-bold h-14 px-8 rounded-xl text-lg">
          {isPending ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-5 w-5" />
          )}
          Générer
        </Button>
      </form>

      {error && (
        <Alert variant="destructive" className="bg-red-900/50 border-red-800 text-white">
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isPending && (
         <div className="text-center p-8 bg-white/5 rounded-xl border border-white/10">
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
            <p className="mt-4 text-gray-400">Notre IA analyse vos besoins...</p>
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="space-y-6 text-left animate-fade-in-up">
           <h3 className="text-2xl font-headline text-white border-b border-white/10 pb-4">
             Services Recommandés
           </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((service) => (
              <div key={service.id} className="group p-6 border border-white/10 rounded-2xl bg-white/5 hover:border-primary/50 transition-all hover:-translate-y-1">
                  <h4 className="font-bold text-xl text-primary mb-2">{service.name}</h4>
                  <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                    {service.description.substring(0, 100)}...
                  </p>
                  <Button 
                    onClick={() => handleBookClick(service.slug)}
                    variant="ghost" 
                    className="w-full text-white hover:text-primary hover:bg-white/5 justify-between group-hover:pl-4 transition-all"
                  >
                      Réserver
                      <ArrowRight className="h-4 w-4" />
                  </Button>
              </div>
            ))}
          </div>
          {reasoning && (
             <Alert className="mt-6 bg-primary/10 border-primary/20 text-gray-300">
                <Wand2 className="h-4 w-4 !text-primary" />
                <AlertTitle className="font-headline text-primary mb-2">Pourquoi ces choix ?</AlertTitle>
                <AlertDescription className="leading-relaxed">
                   {reasoning}
                </AlertDescription>
             </Alert>
          )}
        </div>
      )}
    </div>
  );
}
