import Link from 'next/link';
import { Facebook, Instagram, Phone, Mail, MapPin, Wind } from 'lucide-react';

const socialLinks = [
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/profile.php?id=61581484462605',
    icon: <Facebook className="h-5 w-5" />,
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/moorish.travels/',
    icon: <Instagram className="h-5 w-5" />,
  },
  {
    name: 'TikTok',
    url: 'https://www.tiktok.com/@moorishtravels',
    icon: (
      <svg
        className="h-5 w-5"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.65 4.28 1.7.03 1.5.02 3 .02 4.48-.15-1.55-.72-3.1-1.83-4.18-1.11-1.1-2.7-1.64-4.28-1.69-.02-1.52-.01-3.04-.01-4.56h-1.5c-.01 2.45-.02 4.91-.01 7.36.01 2.3.02 4.6.01 6.9 0 1.61-.53 3.2-1.66 4.31-1.1 1.08-2.63 1.6-4.2 1.6-.02 1.5-.01 3-.01 4.48.15-1.55.72-3.1 1.83-4.18 1.11-1.1 2.7-1.64 4.28-1.69.02-2.43.01-4.87.01-7.3Zm-3.11 6.55c-1.35-.02-2.69-.05-4.04-.04.01-1.49.01-2.99.02-4.48-1.55.13-3.09.7-4.18 1.81-1.08 1.1-1.62 2.68-1.68 4.27-.04 1.51-.03 3.02-.03 4.53h1.5c.01-2.45.02-4.91.01-7.36.01-2.3.02-4.6.01-6.9 0-1.61.53-3.2 1.66-4.31 1.1-1.08 2.63 1.6 4.2-1.6.03-1.5.02-3 .02-4.48Z" />
      </svg>
    ),
  },
  {
    name: 'WhatsApp',
    url: 'https://wa.me/212628438838',
    icon: (
      // Using a path from lucide-icons for WhatsApp
      <svg
        className="h-5 w-5"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M16.75 13.96c.25.13.4.38.4.66v1.52c0 .63-.51 1.14-1.14 1.14-.16 0-.32-.03-.48-.09-.57-.24-2.22-.99-3.95-2.71-1.85-1.85-2.5-3.5-2.71-3.95-.06-.16-.09-.32-.09-.48 0-.63.51-1.14 1.14-1.14h1.52c.28 0 .53.15.66.4.45.88.9 1.76.9 1.76.13.25.06.56-.15.73l-.6.53c-.15.13-.17.36-.05.51.32.44.82.94 1.26 1.38.44.44.94.94 1.38 1.26.15.12.38.1.51-.05l.53-.6c.17-.21.48-.28.73-.15 0 0 .88.45 1.76.9zM12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-card">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <Wind className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold font-headline">
                Moroccan Coastal Adventures
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Discover Morocco&apos;s Hidden Coastal Treasures since 2010.
            </p>
          </div>
          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="text-md font-semibold font-headline tracking-wider text-primary">
                Explore
              </h3>
              <ul className="mt-4 space-y-2">
                <li><Link href="#about" className="text-sm text-muted-foreground hover:text-foreground">About Us</Link></li>
                <li><Link href="#services" className="text-sm text-muted-foreground hover:text-foreground">Services</Link></li>
                <li><Link href="#recommendations" className="text-sm text-muted-foreground hover:text-foreground">Find Your Adventure</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-md font-semibold font-headline tracking-wider text-primary">
                Contact Us
              </h3>
              <ul className="mt-4 space-y-2">
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 mt-0.5 shrink-0 text-muted-foreground" />
                  <span className="ml-3 text-sm text-muted-foreground">Essaouira, Morocco</span>
                </li>
                <li className="flex items-center">
                  <Mail className="h-5 w-5 shrink-0 text-muted-foreground" />
                  <a href="mailto:contact@essaouira-travel.services" className="ml-3 text-sm text-muted-foreground hover:text-foreground">moorisutility@gmail.com</a>
                </li>
                <li className="flex items-center">
                  <Phone className="h-5 w-5 shrink-0 text-muted-foreground" />
                  <a href="tel:+212628438838" className="ml-3 text-sm text-muted-foreground hover:text-foreground">+212 628 438 838</a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-md font-semibold font-headline tracking-wider text-primary">
                Follow Us
              </h3>
              <div className="mt-4 flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary"
                  >
                    <span className="sr-only">{social.name}</span>
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Moroccan Coastal Adventures. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
