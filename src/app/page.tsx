import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { services } from '@/lib/services';
import ServiceList from '@/components/services/ServiceList';
import { Card, CardContent } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import RecommendationEngine from '@/components/ai/RecommendationEngine';
import { Award, Star, Users } from 'lucide-react';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-home');

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[60vh] w-full text-white">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
          <h1 className="font-headline text-5xl font-bold md:text-7xl">
            Moroccan Coastal Adventures
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl">
            Discover Morocco&apos;s Hidden Coastal Treasures
          </p>
          <Button asChild className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="#services">Explore Our Adventures</Link>
          </Button>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-16 md:py-24">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
            <div>
              <h2 className="font-headline text-4xl font-bold text-primary">
                Our Story
              </h2>
              <p className="mt-4 text-lg text-foreground/80">
                For over a decade, Moroccan Coastal Adventures has been the leading
                expert in crafting unforgettable experiences along the beautiful
                shores of Essaouira. Our passion is sharing the magic of Morocco,
                from thrilling water sports to serene beach escapades.
              </p>
              <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                <div className="rounded-lg border bg-card p-4 shadow-sm">
                  <Award className="mx-auto mb-2 h-8 w-8 text-accent" />
                  <p className="font-bold text-xl">10+ Years</p>
                  <p className="text-sm text-muted-foreground">Experience</p>
                </div>
                <div className="rounded-lg border bg-card p-4 shadow-sm">
                  <Users className="mx-auto mb-2 h-8 w-8 text-accent" />
                  <p className="font-bold text-xl">5,000+</p>
                  <p className="text-sm text-muted-foreground">Happy Guests</p>
                </div>
                <div className="rounded-lg border bg-card p-4 shadow-sm">
                  <Star className="mx-auto mb-2 h-8 w-8 text-accent" />
                  <p className="font-bold text-xl">4.9/5</p>
                  <p className="text-sm text-muted-foreground">Average Rating</p>
                </div>
              </div>
            </div>
            <div className="relative h-80 w-full overflow-hidden rounded-xl shadow-lg">
               <Image
                src="https://picsum.photos/seed/about-us/600/400"
                alt="Happy tourists in Morocco"
                fill
                className="object-cover"
                data-ai-hint="happy tourists"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 md:py-24 bg-card">
        <div className="container mx-auto text-center">
          <h2 className="font-headline text-4xl font-bold text-primary">
            Our Adventures
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-foreground/80">
            Whether you seek adrenaline-pumping action or peaceful exploration, we
            have the perfect coastal adventure waiting for you.
          </p>
          <ServiceList services={services} />
        </div>
      </section>

      {/* AI Recommendation Section */}
      <section id="recommendations" className="py-16 md:py-24">
         <div className="container mx-auto text-center">
           <h2 className="font-headline text-4xl font-bold text-primary">
             Find Your Perfect Adventure
           </h2>
           <p className="mx-auto mt-4 max-w-3xl text-lg text-foreground/80">
            Tell us what you&apos;re looking for, and our AI-powered guide will suggest the best activities based on your interests and past explorations.
           </p>
           <Card className="mx-auto mt-8 max-w-4xl bg-card shadow-lg">
             <CardContent className="p-6 md:p-8">
               <RecommendationEngine />
             </CardContent>
           </Card>
         </div>
       </section>
    </div>
  );
}
