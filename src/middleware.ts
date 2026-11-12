import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Intercept registration or location verification requests
  if (pathname.startsWith('/api/auth/verify-location')) {
    const pinCode = request.headers.get('x-user-pincode');
    const secretPin = process.env.AUTHORIZED_PIN_CODE;

    if (!pinCode || pinCode !== secretPin) {
      return NextResponse.json(
        { error: 'Sorry! REBOOT is currently available only in our service area.' },
        { status: 403 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/auth/verify-location'],
};
