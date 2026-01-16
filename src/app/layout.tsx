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
    default: "Essaouira Adventures - Private Transfers & Airport Taxi",
    template: "%s | Essaouira Adventures"
  },
  description:
    "Book your private taxi between Marrakech, Essaouira and Agadir. Comfortable, air-conditioned tourist transport service available 24/7. Airport transfers and excursions.",
  keywords:
    "Taxi Marrakech Essaouira, Essaouira transport, Taxi Essaouira airport, Marrakech Essaouira transport, cheap travel, cheap taxi transport, cab Marrakech Essaouira, Taxi Essaouira Morocco, Taxi Agadir Essaouira, Taxi Marrakech to essaouira, Taxi excursion Marrakech Essaouira, holiday taxis, Taxi from Marrakech to Essaouira, taxi price, taxi booking, taxi fare, Riad, Taxi airport Marrakech, Taxi Marrakech casablanca, Taxi Essaouira casablanca",
  authors: [{ name: "Essaouira Adventures" }],
  creator: "Essaouira Adventures",
  publisher: "Essaouira Adventures",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://essaouira-travel.services",
    title: "Essaouira Adventures - Private Transfers & Airport Taxi",
    description: "Your private driver in Morocco. Airport transfers Marrakech, Agadir, Essaouira and tourist excursions. Simple and fast online booking.",
    siteName: "Essaouira Adventures",
    images: [
      {
        url: "https://res.cloudinary.com/doy1q2tfm/image/upload/v1766384357/taxi-marrakech-essaouira-transfert_anisai.jpg",
        width: 1200,
        height: 630,
        alt: "Essaouira Adventures Transport",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Essaouira Adventures - Tourist Transport",
    description: "Book your private trip safely. Morocco, Essaouira, Marrakech, Agadir.",
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
    <html lang="en" suppressHydrationWarning>
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
