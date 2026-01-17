
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Essaouira Adventures',
  description: 'Privacy Policy and Data Protection for Essaouira Adventures.',
};

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl">
      <Link href="/" className="inline-flex items-center text-sm text-primary mb-6 hover:underline transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
      </Link>
      <h1 className="text-4xl font-bold font-headline mb-8 text-foreground">Privacy Policy</h1>
      
      <div className="prose prose-lg max-w-none text-muted-foreground">
        <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <h2>1. Introduction</h2>
        <p>
          Welcome to Essaouira Adventures. We respect your privacy and are committed to protecting your personal data.
          This privacy policy will inform you as to how we look after your personal data when you visit our website
          and tell you about your privacy rights and how the law protects you.
        </p>

        <h2>2. Data We Collect</h2>
        <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Identity Data:</strong> includes first name, last name.</li>
          <li><strong>Contact Data:</strong> includes email address and telephone number.</li>
          <li><strong>Transaction Data:</strong> includes details about payments to and from you and other details of services you have purchased from us.</li>
          <li><strong>Technical Data:</strong> includes internet protocol (IP) address, browser type and version, time zone setting and location, and other technology on the devices you use to access this website.</li>
        </ul>

        <h2>3. How We Use Your Data</h2>
        <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>To process your booking request and manage your reservation.</li>
          <li>To communicate with you via WhatsApp or Email regarding your trip.</li>
          <li>To improve our website and services.</li>
        </ul>

        <h2>4. Data Security</h2>
        <p>
          We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.
        </p>

        <h2>5. Your Legal Rights</h2>
        <p>
          Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, restriction, transfer, to object to processing, to portability of data and (where the lawful ground of processing is consent) to withdraw consent.
        </p>

        <h2>6. Contact Us</h2>
        <p>
          If you have any questions about this privacy policy or our privacy practices, please contact us at: 
          <a href="mailto:moorishutility@gmail.com" className="text-primary hover:underline ml-1">moorishutility@gmail.com</a>.
        </p>
      </div>
    </div>
  );
}
