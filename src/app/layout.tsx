import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { FirebaseClientProvider } from "@/firebase/client-provider";

export const metadata: Metadata = {
  title: "Taxi Marrakech Essaouira - Taxi Essaouira Marrakech",
  description:
    "Taxi Marrakech, Taxi Essaouira, transport Taxi Marrakech Essaouira pas cher en 2h30 de route, réserver Taxi Marrakech Essaouira depuis l'Aéroport, Taxi sécurisé et climatisé, Taxi Marrakech Essaouira, Transfert Aéroport",
  keywords:
    "Taxi Marrakech Essaouira, transport Essaouira, Taxi Essaouira aeroport, transport Marrakech Essaouira, voyage pas cher, transport Taxi pas cher, cab Marrakech Essaouira, transport Taxi Essaouira maroc, Taxi agadir Essaouira, Taxi Marrakech to essaouira, Taxi excursion Marrakech Essaouira, holidy taxis, Taxi from Marrakech to Essaouira, prix taxi, réservation taxi, tarif taxi, Riad, Taxi aeroport Marrakech, Taxi Marrakech casablanca, Taxi Essaouira casablanca",
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
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
