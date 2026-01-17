'use client';

import Link from 'next/link';
import { Facebook, Instagram, Phone, Mail, MapPin, Compass, MessageCircle, Youtube, Video } from 'lucide-react';

const socialLinks = [
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/profile.php?id=61586080544562',
    icon: <Facebook className="h-5 w-5" />,
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/essaouira_adventure/',
    icon: <Instagram className="h-5 w-5" />,
  },
  {
    name: 'TikTok',
    url: 'https://www.tiktok.com/@moroccan.adventur0',
    icon: <Video className="h-5 w-5" />,
  },
  {
    name: 'YouTube',
    url: 'https://www.youtube.com/channel/UCiZGpNaDfQsV5XQE-8FIlPA',
    icon: <Youtube className="h-5 w-5" />,
  },
  {
    name: 'WhatsApp',
    url: 'https://wa.me/212628438838',
    icon: <MessageCircle className="h-5 w-5" />,
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-white/10 text-gray-400">
      <div className="container mx-auto py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Compass className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold font-headline text-white">
                ESSAOUIRA <span className="text-primary">ADVENTURES</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Your trusted partner for all your trips in Morocco. 
              Professional, punctual, and comfortable service 24/7.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-6 font-headline">Navigation</h3>
            <ul className="space-y-3">
              <li><Link href="/#hero" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/#services" className="hover:text-primary transition-colors">Our Adventures</Link></li>
              <li><Link href="/#contact" className="hover:text-primary transition-colors">Booking</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/legal" className="hover:text-primary transition-colors">Legal Notice</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold mb-6 font-headline">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mt-1 mr-3 text-primary shrink-0" />
                <span>Essaouira, Morocco</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-primary shrink-0" />
                <a href="tel:+212628438838" className="hover:text-white transition-colors">+212 628 438 838</a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-primary shrink-0" />
                <a 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = 'mailto:moorishutility' + '@' + 'gmail.com';
                  }}
                  className="hover:text-white transition-colors"
                >
                  moorishutility<span>@</span>gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Legal / Social */}
          <div>
            <h3 className="text-white font-bold mb-6 font-headline">Follow Us</h3>
            <div className="flex space-x-4 mb-6">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-black transition-all"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* SEO & Credits */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs md:text-sm">
          <p className="text-gray-400 md:text-left mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Essaouira Adventures. All rights reserved.
          </p>
          <p className="text-gray-400 md:text-right">
            Marrakech Essaouira Adventures • Moroccan Cooking Class • Essaouira Excursions • Quad Biking
          </p>
          </div>
        </div>

    </footer>
  );
}
