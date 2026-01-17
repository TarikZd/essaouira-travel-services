import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { booking_id } = body;

    // Validate input
    if (!booking_id) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      );
    }

    // Check if booking exists and can be cancelled
    const { data: existing, error: fetchError } = await supabase
      .from('bookings')
      .select('id, status, reference_number')
      .eq('id', booking_id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Check if already cancelled or completed
    if (['cancelled', 'cancellation_requested', 'completed'].includes(existing.status)) {
      return NextResponse.json(
        { error: 'This booking cannot be cancelled' },
        { status: 400 }
      );
    }

    // Update booking status to cancellation_requested
    const { error: updateError } = await supabase
      .from('bookings')
      .update({ 
        status: 'cancellation_requested',
        updated_at: new Date().toISOString()
      })
      .eq('id', booking_id);

    if (updateError) {
      console.error('Error updating booking:', updateError);
      return NextResponse.json(
        { error: 'Failed to process cancellation' },
        { status: 500 }
      );
    }

    // TODO: Send notification email to admin
    // You can integrate an email service here (Resend, SendGrid, etc.)

    return NextResponse.json({
      success: true,
      message: 'Cancellation request received',
      reference_number: existing.reference_number,
    });
  } catch (error) {
    console.error('Cancellation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
