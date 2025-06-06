import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

const secret = process.env.NEXT_PUBLIC_JWT_SECRET;

if (!secret) {
  throw new Error('NEXT_PUBLIC_JWT_SECRET is not set in environment variables.');
}

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    const correctUsername = process.env.NEXT_PUBLIC_ADMIN_USERNAME;
    const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

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