'use client';

import { useState } from 'react';
import { AlertTriangle, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface CancellationModalProps {
  bookingId: string;
  referenceNumber: string;
  serviceName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CancellationModal({
  bookingId,
  referenceNumber,
  serviceName,
  onClose,
  onSuccess,
}: CancellationModalProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleCancel = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/bookings/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking_id: bookingId }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: 'Cancellation Failed',
          description: data.error || 'Failed to process cancellation request.',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Cancellation Requested',
        description: 'We have received your cancellation request. Our team will contact you shortly to process your refund.',
      });

      onSuccess();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit cancellation request. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-destructive/10 p-2 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-foreground">Cancel Booking?</h3>
              <p className="text-sm text-muted-foreground">Ref: {referenceNumber}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            disabled={loading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="space-y-4 mb-6">
          <p className="text-sm text-foreground">
            You are about to cancel your booking for:
          </p>
          <div className="bg-muted/50 border border-border rounded-lg p-3">
            <p className="font-medium text-foreground">{serviceName}</p>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
            <p className="text-sm text-amber-900 dark:text-amber-200">
              <strong>Please note:</strong> Cancellations are subject to our cancellation policy. 
              Refunds will be processed according to how far in advance you cancel.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          >
            Keep Booking
          </Button>
          <Button
            variant="destructive"
            onClick={handleCancel}
            disabled={loading}
            className="flex-1"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Confirm Cancellation'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
