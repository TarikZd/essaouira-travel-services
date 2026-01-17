'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Users, CreditCard, X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CancellationModal from './CancellationModal';

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

interface BookingDetailsProps {
  booking: Booking;
  onClose: () => void;
}

export default function BookingDetails({ booking, onClose }: BookingDetailsProps) {
  const [showCancellation, setShowCancellation] = useState(false);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      confirmed: { variant: 'default', label: 'Confirmed' },
      pending_payment: { variant: 'secondary', label: 'Pending Payment' },
      cancellation_requested: { variant: 'destructive', label: 'Cancellation Requested' },
      cancelled: { variant: 'destructive', label: 'Cancelled' },
      completed: { variant: 'outline', label: 'Completed' },
    };

    const config = variants[status] || { variant: 'secondary', label: status };
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
  };

  const getPaymentBadge = (paymentStatus: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      unpaid: { variant: 'destructive', label: 'Unpaid' },
      deposit_paid: { variant: 'default', label: 'Deposit Paid' },
      fully_paid: { variant: 'default', label: 'Paid' },
      refunded: { variant: 'secondary', label: 'Refunded' },
    };

    const config = variants[paymentStatus] || { variant: 'secondary', label: paymentStatus };
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
  };

  const canCancel = !['cancelled', 'cancellation_requested', 'completed'].includes(booking.status);

  return (
    <>
      <div className="max-w-3xl mx-auto">
        <div className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-primary/5 border-b border-border p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-1">
                  {booking.service_name}
                </h2>
                <p className="text-sm text-muted-foreground font-mono">
                  Ref: {booking.reference_number}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Details */}
          <div className="p-6 space-y-6">
            {/* Status */}
            <div className="flex gap-4 flex-wrap">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                {getStatusBadge(booking.status)}
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Payment</p>
                {getPaymentBadge(booking.payment_status)}
              </div>
            </div>

            {/* Key Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Date & Time</p>
                  <p className="font-medium text-foreground">
                    {format(new Date(booking.activity_date), 'EEEE, MMMM d, yyyy')}
                    {booking.start_time && ` at ${booking.start_time}`}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Participants</p>
                  <p className="font-medium text-foreground">
                    {booking.participants} {booking.participants === 1 ? 'person' : 'people'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CreditCard className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Price</p>
                  <p className="font-medium text-foreground">€{booking.total_price}</p>
                  <p className="text-xs text-muted-foreground">
                    Deposit: €{booking.deposit_amount}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 flex items-center justify-center text-primary mt-0.5">
                  👤
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contact</p>
                  <p className="font-medium text-foreground">{booking.customer.full_name}</p>
                  <p className="text-xs text-muted-foreground">{booking.customer.email}</p>
                </div>
              </div>
            </div>

            {/* Cancellation Section */}
            {canCancel && (
              <div className="border-t border-border pt-6">
                <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">
                        Need to cancel?
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Cancel your booking and we'll process your refund according to our cancellation policy.
                      </p>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setShowCancellation(true)}
                      >
                        Request Cancellation
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Already Cancelled */}
            {booking.status === 'cancellation_requested' && (
              <div className="bg-muted/50 border border-border rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  ⏳ Your cancellation request has been received. Our team will process it and contact you shortly.
                </p>
              </div>
            )}

            {booking.status === 'cancelled' && (
              <div className="bg-muted/50 border border-border rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  ❌ This booking has been cancelled.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cancellation Modal */}
      {showCancellation && (
        <CancellationModal
          bookingId={booking.id}
          referenceNumber={booking.reference_number}
          serviceName={booking.service_name}
          onClose={() => setShowCancellation(false)}
          onSuccess={() => {
            setShowCancellation(false);
            onClose();
          }}
        />
      )}
    </>
  );
}
