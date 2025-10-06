import { NextResponse } from 'next/server';

interface InstagramMedia {
  id: string;
  caption?: string;
  media_url: string;
  permalink: string;
  media_type: string;
  thumbnail_url?: string;
  timestamp?: string;
}

const ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN ?? '';
const GRAPH_API_URL = 'https://graph.instagram.com/me/media';

export async function GET() {
  if (!ACCESS_TOKEN) {
    return NextResponse.json(
      {
        data: [],
        message: 'Instagram access token is not configured.',
      },
      { status: 200 }
    );
  }

  const params = new URLSearchParams({
    fields: 'id,caption,media_url,permalink,media_type,thumbnail_url,timestamp',
    access_token: ACCESS_TOKEN,
    limit: '12',
  });

  try {
    const response = await fetch(`${GRAPH_API_URL}?${params.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          data: [],
          message: `Instagram API request failed with status ${response.status}`,
        },
        { status: response.status }
      );
    }

    const payload = await response.json();
    const data: InstagramMedia[] = Array.isArray(payload?.data) ? payload.data : [];

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Instagram API error', error);
    return NextResponse.json(
      {
        data: [],
        message: 'An unexpected error occurred when fetching Instagram data.',
      },
      { status: 500 }
    );
  }
}
