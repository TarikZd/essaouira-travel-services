
'use client';

import Link from 'next/link';
import { Menu, Wind, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { services } from '@/lib/services';
import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const mainServices = services.slice(0, 3);
  const moreServices = services.slice(3);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <Wind className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block font-headline">
              Moroccan Coastal Adventures
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
          {mainServices.map((service) => (
            <Link
              key={service.id}
              href={`/services/${service.slug}`}
              className="transition-colors hover:text-primary"
            >
              {service.name}
            </Link>
          ))}
          {moreServices.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 transition-colors hover:text-primary outline-none">
                More
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {moreServices.map((service) => (
                  <DropdownMenuItem key={service.id} asChild>
                    <Link href={`/services/${service.slug}`}>
                      {service.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>

        {/* Mobile Navigation */}
        <div className="flex flex-1 items-center justify-end space-x-4 md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu />
                <span className="sr-only">Open Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle className="flex items-center space-x-2">
                  <Wind className="h-6 w-6 text-primary" />
                  <span className="font-bold font-headline">MCA</span>
                </SheetTitle>
              </SheetHeader>
              <div className="mt-8 flex flex-col space-y-4">
                {services.map((service) => (
                  <Link
                    key={service.id}
                    href={`/services/${service.slug}`}
                    className="text-lg transition-colors hover:text-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    {service.name}
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
