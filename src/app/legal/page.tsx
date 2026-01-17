
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Legal Notice | Essaouira Adventures',
  description: 'Legal Information and Company Details.',
};

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function LegalPage() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl">
      <Link href="/" className="inline-flex items-center text-sm text-primary mb-6 hover:underline transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
      </Link>
      <h1 className="text-4xl font-bold font-headline mb-8 text-foreground">Legal Notice</h1>
      
      <div className="prose prose-lg max-w-none text-muted-foreground">
        <h2>1. Editor</h2>
        <p>
          The website <strong>Essaouira Adventures</strong> is published by:
          <br/>
          <strong>Company Name:</strong> Essaouira Adventures
          <br/>
          <strong>Address:</strong> Essaouira, Morocco
          <br/>
          <strong>Email:</strong> <a href="mailto:moorishutility@gmail.com" className="text-primary hover:underline">moorishutility@gmail.com</a>
          <br/>
          <strong>Phone:</strong> +212 628 438 838
        </p>

        <h2>2. Hosting</h2>
        <p>
          This website is hosted by <strong>Vercel Inc.</strong>
          <br/>
          Address: 340 S Lemon Ave #4133 Walnut, CA 91789, USA.
        </p>

        <h2>3. Intellectual Property</h2>
        <p>
          All content on this website (includes text, images, graphics, logos) is the property of Essaouira Adventures or its content suppliers and is protected by international copyright laws. Unauthorized use or reproduction is strictly prohibited.
        </p>

        <h2>4. Credits</h2>
        <p>
          Design & Development: Essaouira Adventures Team.
          <br/>
          Images: Essaouira Adventures, Unsplash, Pexels.
        </p>
      </div>
    </div>
  );
}
