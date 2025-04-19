import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const events = await request.json();
    
    // Store events in localStorage on the client side instead
    // This endpoint just validates the data and returns success
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating calendar events:', error);
    return NextResponse.json(
      { error: 'Failed to update calendar events' },
      { status: 500 }
    );
  }
} 