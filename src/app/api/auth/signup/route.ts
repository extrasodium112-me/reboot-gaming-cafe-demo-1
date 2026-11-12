import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import argon2 from 'argon2';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, username, phone, pinCode, password } = body;

    // 1. Server-side PIN code check
    if (pinCode !== process.env.AUTHORIZED_PIN_CODE) {
      return NextResponse.json(
        { error: 'Sorry! REBOOT is currently available only in our service area.' },
        { status: 403 }
      );
    }

    // 2. Normalize and check username uniqueness (case-insensitive)
    const normalizedUsername = username.trim().toLowerCase();
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .ilike('username', normalizedUsername)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username is already taken. Please choose another.' },
        { status: 400 }
      );
    }

    // 3. Hash password securely using Argon2id
    const passwordHash = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
    });

    // 4. Insert user into database
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert([
        {
          full_name: fullName,
          username: normalizedUsername,
          phone,
          password_hash: passwordHash,
          role: 'customer',
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Account created successfully.' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
