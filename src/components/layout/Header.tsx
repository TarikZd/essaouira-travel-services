'use client';

import Link from 'next/link';
import { Menu, Car, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Accueil', href: '/#hero' },
    { label: 'Destinations', href: '/#destinations' },
    { label: 'Services', href: '/#services' },
    { label: 'Avis', href: '/#reviews' },
    { label: 'Conseils', href: '/conseils-voyage' },
    { label: 'Contact', href: '/#contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/#')) {
        // If we are on the homepage, scroll. If not, let Next.js navigate to /#id
        if (window.location.pathname === '/') {
            e.preventDefault();
            const targetId = href.replace('/#', '');
            const elem = document.getElementById(targetId);
            elem?.scrollIntoView({ behavior: 'smooth' });
        }
        // Else: do nothing, let standard navigation happen
    }
    setIsOpen(false);
  };
 
  return (
    <header className={cn(
      "fixed top-0 z-50 w-full transition-all duration-300",
      scrolled ? "bg-black/90 backdrop-blur-md py-4 shadow-lg border-b border-white/10" : "bg-transparent py-6"
    )}>
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Car className="h-8 w-8 text-primary" />
          <span className="font-bold text-xl font-headline tracking-tighter">
            TAXI <span className="text-primary">ESSAOUIRA</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center space-x-8 text-sm font-semibold md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="transition-colors text-white/80 hover:text-primary uppercase tracking-widest text-[11px]"
            >
              {link.label}
            </Link>
          ))}
          <Button 
            className="bg-primary text-black hover:bg-yellow-500 font-bold px-6 rounded-full"
            onClick={() => document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' })}
          >
            RÉSERVER
          </Button>
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-black border-white/10 text-white">
              <SheetHeader>
                <SheetTitle className="flex items-center space-x-2 text-white">
                  <Car className="h-8 w-8 text-primary" />
                  <span className="font-bold font-headline tracking-tighter">TAXI ESSAOUIRA</span>
                </SheetTitle>
              </SheetHeader>
              <div className="mt-12 flex flex-col space-y-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-2xl font-bold transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
