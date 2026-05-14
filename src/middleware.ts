import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the hostname from the headers
  const host = request.headers.get('host') || '';
  const hostname = host.split(':')[0];

  // Allowed hostnames
  const allowedHosts = [
    'moonstruck.evoclabs.com',
    'localhost',
    '127.0.0.1'
  ];

  // If the hostname is not allowed, rewrite the request to the store-not-found page
  if (!allowedHosts.includes(hostname)) {
    return NextResponse.rewrite(new URL('/store-not-found', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
