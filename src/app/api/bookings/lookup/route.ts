import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reference_number, email } = body;

    // Validate inputs
    if (!reference_number || !email) {
      return NextResponse.json(
        { error: 'Reference number and email are required' },
        { status: 400 }
      );
    }

    // Lookup booking
    const { data: booking, error } = await supabase
      .from('bookings')
      .select(`
        *,
        customer:customers(full_name, email, phone)
      `)
      .eq('reference_number', reference_number.toUpperCase())
      .single();

    if (error || !booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Verify email matches (security check)
    if (booking.customer.email.toLowerCase() !== email.toLowerCase()) {
     return NextResponse.json(
        { error: 'Email does not match booking records' },
        { status: 403 }
      );
    }

    // Return booking details
    return NextResponse.json({
      booking: {
        id: booking.id,
        reference_number: booking.reference_number,
        service_name: booking.service_name,
        activity_date: booking.activity_date,
        start_time: booking.start_time,
        participants: booking.participants,
        total_price: booking.total_price,
        deposit_amount: booking.deposit_amount,
        status: booking.status,
        payment_status: booking.payment_status,
        created_at: booking.created_at,
        customer: booking.customer,
      },
    });
  } catch (error) {
    console.error('Booking lookup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
