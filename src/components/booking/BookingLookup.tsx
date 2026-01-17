'use client';

import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { isValidBookingReference } from '@/lib/booking-reference';
import BookingDetails from './BookingDetails';

interface Booking {
  id: string;
  reference_number: string;
  service_name: string;
  activity_date: string;
  start_time?: string;
  participants: number;
  total_price: number;
  deposit_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
  customer: {
    full_name: string;
    email: string;
    phone: string;
  };
}

export default function BookingLookup() {
  const [referenceNumber, setReferenceNumber] = useState('');
  const [email, setEmail] = useState('');
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate reference format
    if (!isValidBookingReference(referenceNumber.trim())) {
      toast({
        title: 'Invalid Reference',
        description: 'Please enter a valid booking reference (e.g., ESS-2026-ABC123)',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    setBooking(null);

    try {
      const response = await fetch('/api/bookings/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reference_number: referenceNumber.trim().toUpperCase(),
          email: email.trim().toLowerCase(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: 'Booking Not Found',
          description: data.error || 'Please check your reference number and email address.',
          variant: 'destructive',
        });
        return;
      }

      setBooking(data.booking);
      toast({
        title: 'Booking Found!',
        description: `We found your booking for ${data.booking.service_name}.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to lookup booking. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Lookup Form */}
      {!booking && (
        <div className="max-w-2xl mx-auto bg-card border border-border rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Check Your Booking
            </h2>
            <p className="text-muted-foreground">
              Enter your booking reference and email to view details or request cancellation
            </p>
          </div>

          <form onSubmit={handleLookup} className="space-y-4">
            <div>
              <Label htmlFor="reference">Booking Reference</Label>
              <Input
                id="reference"
                type="text"
                placeholder="ESS-2026-ABC123"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value.toUpperCase())}
                required
                className="font-mono"
              />
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Find My Booking
                </>
              )}
            </Button>
          </form>
        </div>
      )}

      {/* Booking Details */}
      {booking && (
        <BookingDetails 
          booking={booking} 
          onClose={() => setBooking(null)}
        />
      )}
    </div>
  );
}
