import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import JsonLd from "@/components/seo/JsonLd";
import { GoogleAnalytics } from "@next/third-parties/google";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://essaouira-travel.services'),
  title: {
    default: "Taxi Marrakech Essaouira - Transport Touristique & Transfert Aéroport",
    template: "%s | Taxi Essaouira"
  },
  description:
    "Réservez votre taxi privé entre Marrakech, Essaouira et Agadir. Service de transport touristique confortable, climatisé et disponible 24/7. Transferts aéroport et excursions.",
  keywords:
    "Taxi Marrakech Essaouira, transport Essaouira, Taxi Essaouira aeroport, transport Marrakech Essaouira, voyage pas cher, transport Taxi pas cher, cab Marrakech Essaouira, transport Taxi Essaouira maroc, Taxi agadir Essaouira, Taxi Marrakech to essaouira, Taxi excursion Marrakech Essaouira, holiday taxis, Taxi from Marrakech to Essaouira, prix taxi, réservation taxi, tarif taxi, Riad, Taxi aeroport Marrakech, Taxi Marrakech casablanca, Taxi Essaouira casablanca",
  authors: [{ name: "Essaouira Travel Services" }],
  creator: "Essaouira Travel Services",
  publisher: "Essaouira Travel Services",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://essaouira-travel.services",
    title: "Taxi Marrakech Essaouira - Transport Touristique & Transfert Aéroport",
    description: "Votre chauffeur privé au Maroc. Transferts aéroports Marrakech, Agadir, Essaouira et excursions touristiques. Réservation en ligne simple et rapide.",
    siteName: "Taxi Essaouira",
    images: [
      {
        url: "https://res.cloudinary.com/doy1q2tfm/image/upload/v1766384357/taxi-marrakech-essaouira-transfert_anisai.jpg",
        width: 1200,
        height: 630,
        alt: "Taxi Marrakech Essaouira Transport",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Taxi Marrakech Essaouira - Transport Touristique",
    description: "Réservez votre trajet privé en toute sécurité. Maroc, Essaouira, Marrakech, Agadir.",
    images: ["https://res.cloudinary.com/doy1q2tfm/image/upload/v1766384357/taxi-marrakech-essaouira-transfert_anisai.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-body antialiased",
          inter.variable,
          outfit.variable
        )}
        suppressHydrationWarning={true}
      >
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <JsonLd />
          <Toaster />
        <GoogleAnalytics gaId="G-BV8084R6GZ" />
      </body>
    </html>
  );
}
