import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import JsonLd from "@/components/seo/JsonLd";
import { GoogleAnalytics } from "@next/third-parties/google";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import ErrorPage from "@/components/ErrorPage";

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
    default: "Essaouira Adventures - Authentic Cooking, Quad & Tours",
    template: "%s | Essaouira Adventures"
  },
  description:
    "Book authentic experiences in Essaouira: Cooking Classes, Quad Biking, Hiking, Fishing, and Pastry Workshops. Discover the real Morocco with local experts.",
  keywords:
    "Essaouira activities, Moroccan cooking class, quad biking Essaouira, surfcasting fishing Morocco, hiking wild beaches, Essaouira medina tour, pastry class Essaouira, things to do in Essaouira, authentic Morocco experiences",
  authors: [{ name: "Essaouira Adventures" }],
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  creator: "Essaouira Adventures",
  publisher: "Essaouira Adventures",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://essaouira-travel.services",
    title: "Essaouira Adventures - Authentic Cooking, Quad & Tours",
    description: "Your gateway to authentic Moroccan adventures. Cooking classes, quad biking, hiking, and cultural tours in Essaouira.",
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
          <ErrorBoundary fallback={<ErrorPage />}>
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </ErrorBoundary>
          <JsonLd />
          <Toaster />
        <GoogleAnalytics gaId="G-BV8084R6GZ" />
      </body>
    </html>
  );
}
