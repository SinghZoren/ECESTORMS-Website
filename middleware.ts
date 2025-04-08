import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if the request is for the admin page
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Check for the isAdmin cookie
    const isAdmin = request.cookies.get('isAdmin');
    
    // If not authenticated, redirect to home page
    if (!isAdmin || isAdmin.value !== 'true') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: '/admin/:path*',
}; 