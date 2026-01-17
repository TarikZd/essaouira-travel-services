
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Essaouira Adventures',
  description: 'Terms and Conditions of service for Essaouira Adventures.',
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl">
      <h1 className="text-4xl font-bold font-headline mb-8 text-foreground">Terms & Conditions</h1>
      
      <div className="prose prose-lg max-w-none text-muted-foreground">
        <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <h2>1. Agreement to Terms</h2>
        <p>
          By accessing and using our services, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access the service.
        </p>

        <h2>2. Booking & Payments</h2>
        <p>
          <strong>Reservations:</strong> All bookings are subject to availability and confirmation by Essaouira Adventures.
          <br/>
          <strong>Payments:</strong> We may require a deposit to secure your booking. The remaining balance is typically payable in cash or via card on the day of the service.
        </p>

        <h2>3. Cancellation Policy</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Free Cancellation:</strong> You may cancel your booking free of charge up to 24 hours before the scheduled start time.</li>
          <li><strong>Late Cancellation:</strong> Cancellations made within 24 hours of the start time may be subject to a fee or loss of deposit.</li>
          <li><strong>No-Show:</strong> Failure to appear for the service without prior notice will result in the full charge being due.</li>
        </ul>

        <h2>4. Limitation of Liability</h2>
        <p>
          Essaouira Adventures acts as an agent/provider for transport and activity services. We are not liable for any injury, damage, loss, accident, delay, or irregularity which may be occasioned by reason of any defect in any vehicle or through the acts or defaults of any company or person engaged in conveying the passenger or in carrying out the arrangements of the tour.
        </p>

        <h2>5. Responsibilities</h2>
        <p>
          <strong>Client Responsibility:</strong> You are responsible for ensuring that you are fit for the chosen activity and for looking after your personal belongings.
          <br/>
          <strong>Provider Responsibility:</strong> We are responsible for providing safe, professional services as described on our website.
        </p>

        <h2>6. Jurisdiction</h2>
        <p>
          These terms shall be governed and construed in accordance with the laws of Morocco, without regard to its conflict of law provisions.
        </p>

        <h2>7. Contact Information</h2>
        <p>
          For any questions regarding these Terms, please contact us at 
          <a href="mailto:moorishutility@gmail.com" className="text-primary hover:underline ml-1">moorishutility@gmail.com</a>.
        </p>
      </div>
    </div>
  );
}
