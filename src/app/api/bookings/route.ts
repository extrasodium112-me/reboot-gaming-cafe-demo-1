import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, stationId, startTime, durationHours } = body;

    const start = new Date(startTime);
    const end = new Date(start.getTime() + durationHours * 60 * 60 * 1000);

    // 1. Fetch station hourly rate from database (Never trust client pricing)
    const { data: station, error: stationErr } = await supabaseAdmin
      .from('stations')
      .select('hourly_rate')
      .eq('id', stationId)
      .single();

    if (stationErr || !station) {
      return NextResponse.json({ error: 'Invalid gaming station selected.' }, { status: 400 });
    }

    const totalAmount = station.hourly_rate * durationHours;
    const bookingId = `RBT-${Math.floor(100000 + Math.random() * 900000)}`;

    // 2. Insert booking (PostgreSQL GIST Exclusion Constraint automatically blocks double bookings)
    const { data, error } = await supabaseAdmin
      .from('bookings')
      .insert([
        {
          booking_id: bookingId,
          user_id: userId,
          station_id: stationId,
          start_time: start.toISOString(),
          end_time: end.toISOString(),
          total_amount: totalAmount,
          status: 'confirmed',
        },
      ])
      .select()
      .single();

    if (error) {
      if (error.code === '23P01') {
        return NextResponse.json(
          { error: 'Selected time slot is already booked for this station. Please choose another time.' },
          { status: 409 }
        );
      }
      throw error;
    }

    return NextResponse.json({ success: true, booking: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Booking failed' }, { status: 500 });
  }
}
