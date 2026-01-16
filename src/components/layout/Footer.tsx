'use client';

import { Facebook, Instagram, Phone, Mail, MapPin, Car, MessageCircle } from 'lucide-react';

const socialLinks = [
  {
    name: 'Facebook',
    url: '#',
    icon: <Facebook className="h-5 w-5" />,
  },
  {
    name: 'Instagram',
    url: '#',
    icon: <Instagram className="h-5 w-5" />,
  },
  {
    name: 'WhatsApp',
    url: 'https://wa.me/212690606068',
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
              <Car className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold font-headline text-white">
                TAXI <span className="text-primary">ESSAOUIRA</span>
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
              <li><a href="#hero" className="hover:text-primary transition-colors">Home</a></li>
              <li><a href="#services" className="hover:text-primary transition-colors">Our Services</a></li>
              <li><a href="#destinations" className="hover:text-primary transition-colors">Destinations</a></li>
              <li><a href="#contact" className="hover:text-primary transition-colors">Booking</a></li>
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
                <a href="tel:+212690606068" className="hover:text-white transition-colors">+212 690 606 068</a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-primary shrink-0" />
                <a 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = 'mailto:adiltaxipro' + '@' + 'gmail.com';
                  }}
                  className="hover:text-white transition-colors"
                >
                  adiltaxipro<span>@</span>gmail.com
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
            &copy; {new Date().getFullYear()} Essaouira Travel Services. All rights reserved.
          </p>
          <p className="text-gray-400 md:text-right">
            Marrakech Essaouira Taxi • Airport Transfer • Essaouira Excursions • Agadir Taxi
          </p>
          </div>
        </div>

    </footer>
  );
}
