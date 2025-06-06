import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error('JWT_SECRET is not set in environment variables.');
}

const secretKey = new TextEncoder().encode(secret);

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Authentication required.' }, { status: 401 });
  }

  try {
    await jwtVerify(token, secretKey);
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
    '/api/upload', // Assuming this is a protected route for resource manager
    '/api/tutorials' // Assuming this is a protected route for tutorials
  ],
}; 