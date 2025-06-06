import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error('JWT_SECRET is not set in environment variables.');
}

export async function POST(req: NextRequest) {
  if (!secret) {
    console.error('JWT secret is not configured.');
    return NextResponse.json({ success: false, message: 'Authentication configuration error.' }, { status: 500 });
  }

  try {
    const { username, password } = await req.json();

    const correctUsername = process.env.ADMIN_USERNAME;
    const correctPassword = process.env.ADMIN_PASSWORD;

    if (username === correctUsername && password === correctPassword) {
      const token = jwt.sign({ username }, secret, { expiresIn: '8h' });

      const cookie = serialize('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 8 * 60 * 60, // 8 hours
        path: '/',
      });

      return NextResponse.json({ success: true }, {
        status: 200,
        headers: { 'Set-Cookie': cookie },
      });
    } else {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, message: 'An internal server error occurred.' }, { status: 500 });
  }
} 