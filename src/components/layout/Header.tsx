'use client';

import Link from 'next/link';
import { Menu, Compass, X } from 'lucide-react';
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
    { label: 'Home', href: '/#hero' },
    { label: 'Destinations', href: '/#destinations' },
    { label: 'Services', href: '/#services' },
    { label: 'Reviews', href: '/#reviews' },
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
      scrolled ? "bg-background/90 backdrop-blur-md py-4 shadow-lg border-b border-border" : "bg-transparent py-6"
    )}>
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Compass className="h-8 w-8 text-primary" />
          <span className={cn("font-bold text-xl font-headline tracking-tighter", scrolled ? "text-foreground" : "text-white")}>
            ESSAOUIRA <span className="text-primary">ADVENTURES</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center space-x-8 text-sm font-semibold md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className={cn(
                "transition-colors uppercase tracking-widest text-[11px]",
                scrolled ? "text-muted-foreground hover:text-primary" : "text-white/80 hover:text-primary"
              )}
            >
              {link.label}
            </Link>
          ))}
          <Button 
            className="bg-primary text-primary-foreground hover:bg-yellow-500 font-bold px-6 rounded-full"
            onClick={() => document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' })}
          >
            BOOK NOW
          </Button>
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className={cn(scrolled ? "text-foreground hover:bg-muted" : "text-white hover:bg-white/10")}>
                <Menu className="h-6 w-6" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background border-border text-foreground">
              <SheetHeader>
                <SheetTitle className="flex items-center space-x-2 text-foreground">
                  <Compass className="h-8 w-8 text-primary" />
                  <span className="font-bold font-headline tracking-tighter">ESSAOUIRA ADVENTURES</span>
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
