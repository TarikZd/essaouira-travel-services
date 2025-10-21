
'use client';

import { useState, useTransition, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Wand2, ArrowRight } from 'lucide-react';
import { getRecommendations } from '@/app/actions';
import { Service, services } from '@/lib/services';
import Link from 'next/link';

export default function RecommendationEngine() {
  const [searchQuery, setSearchQuery] = useState('');
  const [recommendations, setRecommendations] = useState<Service[]>([]);
  const [reasoning, setReasoning] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [browsingHistory, setBrowsingHistory] = useState<string[]>([]);
  
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith('/services/')) {
      const serviceSlug = pathname.split('/')[2];
      const serviceName = services.find(s => s.slug === serviceSlug)?.name;
      if (serviceName && !browsingHistory.includes(serviceName)) {
        const newHistory = [...browsingHistory, serviceName];
        setBrowsingHistory(newHistory);
      }
    }
  }, [pathname]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setRecommendations([]);
    setReasoning('');

    startTransition(async () => {
      const result = await getRecommendations(searchQuery, browsingHistory);
      if ('error' in result) {
        setError(result.error);
      } else {
        setRecommendations(result.recommendedServices);
        setReasoning(result.reasoning);
      }
    });
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="e.g., 'a relaxing day on the beach' or 'thrilling adventure'"
          className="flex-grow text-base"
        />
        <Button type="submit" disabled={isPending} className="bg-primary hover:bg-primary/90">
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-4 w-4" />
          )}
          Get Suggestions
        </Button>
      </form>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isPending && (
         <div className="text-center p-4">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-muted-foreground">Our AI is finding your perfect adventure...</p>
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="space-y-4 text-left">
           <h3 className="text-2xl font-headline text-primary">Our Recommendations For You</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((service) => (
              <Link href={`/services/${service.slug}`} key={service.id} className="group">
                <div className="p-4 border rounded-lg h-full bg-background hover:border-primary transition-colors">
                    <h4 className="font-bold text-lg text-primary group-hover:underline">{service.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {service.description.substring(0, 100)}...
                    </p>
                    <div className="flex items-center text-sm text-primary font-semibold mt-4">
                        View Details
                        <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                </div>
              </Link>
            ))}
          </div>
          {reasoning && (
             <Alert className="mt-6 bg-primary/5 border-primary/20">
                <Wand2 className="h-4 w-4 !text-primary" />
                <AlertTitle className="font-headline text-primary">Why these suggestions?</AlertTitle>
                <AlertDescription className="prose prose-sm max-w-none text-foreground/80 whitespace-pre-line">
                   {reasoning}
                </AlertDescription>
             </Alert>
          )}
        </div>
      )}
    </div>
  );
}
