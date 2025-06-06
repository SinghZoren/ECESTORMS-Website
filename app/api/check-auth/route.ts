import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error('JWT_SECRET is not set in environment variables.');
}

export async function GET(req: NextRequest) {
  if (!secret) {
    // This case should ideally not be reached if the initial check is effective,
    // but it satisfies TypeScript's static analysis.
    return NextResponse.json({ isLoggedIn: false, error: 'JWT secret not configured.' });
  }

  const token = req.cookies.get('auth_token')?.value;

  if (token) {
    try {
      jwt.verify(token, secret);
      return NextResponse.json({ isLoggedIn: true });
    } catch {
      // Token is invalid or expired
      return NextResponse.json({ isLoggedIn: false });
    }
  }

  return NextResponse.json({ isLoggedIn: false });
} 