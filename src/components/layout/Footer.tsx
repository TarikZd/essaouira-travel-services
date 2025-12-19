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
              <Car className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold font-headline text-white">
                TAXI <span className="text-primary">ESSAOUIRA</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Votre partenaire de confiance pour tous vos déplacements au Maroc. 
              Service professionnel, ponctuel et confortable 24/7.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-6 font-headline">Navigation</h3>
            <ul className="space-y-3">
              <li><a href="#hero" className="hover:text-primary transition-colors">Accueil</a></li>
              <li><a href="#services" className="hover:text-primary transition-colors">Nos Services</a></li>
              <li><a href="#destinations" className="hover:text-primary transition-colors">Destinations</a></li>
              <li><a href="#contact" className="hover:text-primary transition-colors">Réservation</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold mb-6 font-headline">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mt-1 mr-3 text-primary shrink-0" />
                <span>Essaouira, Maroc</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-primary shrink-0" />
                <a href="tel:+212628438838" className="hover:text-white transition-colors">+212 628 438 838</a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-primary shrink-0" />
                <a href="mailto:contact@taxi-essaouira.com" className="hover:text-white transition-colors">contact@taxi-essaouira.com</a>
              </li>
            </ul>
          </div>

          {/* Legal / Social */}
          <div>
            <h3 className="text-white font-bold mb-6 font-headline">Suivez-nous</h3>
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
        <div className="mt-16 pt-8 border-t border-white/10 text-xs text-center md:text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p>&copy; {currentYear} Essaouira Travel Services. Tous droits réservés.</p>
            <p className="text-gray-600 md:text-right">
              Taxi Marrakech Essaouira • Transfert Aéroport • Excursion Essaouira • Taxi Agadir Essaouira
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
