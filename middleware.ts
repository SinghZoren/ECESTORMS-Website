import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error('JWT_SECRET is not set in environment variables.');
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Authentication required.' }, { status: 401 });
  }

  try {
    const secretKey = new TextEncoder().encode(secret);
    await jwtVerify(token, secretKey, { algorithms: ['HS256'] });
    return NextResponse.next();
  } catch (error) {
    console.error('JWT Verification Error:', error);
    return NextResponse.json({ message: 'Invalid token.' }, { status: 401 });
  }
}

export const config = {
  matcher: [
    '/api/updateOfficeHours',
    '/api/updateTeamMembers',
    '/api/updateCalendar',
    '/api/updateSponsors',
    '/api/updatePastEvents',
    '/api/updateShopItems',
    '/api/conferenceVisibility',
    '/api/upload',
    '/api/tutorials/:path*',
  ],
};