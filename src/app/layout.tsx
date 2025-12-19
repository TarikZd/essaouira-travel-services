import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import JsonLd from "@/components/seo/JsonLd";
import { FirebaseClientProvider } from "@/firebase/client-provider";

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
        url: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1200&auto=format&fit=crop",
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
    images: ["https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1200&auto=format&fit=crop"],
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn("min-h-screen bg-background font-body antialiased")}
        suppressHydrationWarning={true}
      >
        <FirebaseClientProvider>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <JsonLd />
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
