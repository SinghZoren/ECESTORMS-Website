import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST() {
  const cookie = serialize('auth_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    expires: new Date(0), // Set expiry to the past to delete the cookie
    path: '/',
  });

  return NextResponse.json({ success: true }, {
    status: 200,
    headers: { 'Set-Cookie': cookie },
  });
} 