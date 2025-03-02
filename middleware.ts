import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This is a simplified middleware for demonstration purposes
// In a real application, this would include JWT validation, rate limiting, etc.

// Paths that don't require authentication
const publicPaths = ['/', '/auth/signin', '/auth/signup', '/auth/reset-password'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the path is public
  if (publicPaths.some(path => pathname === path || pathname.startsWith(path + '/'))) {
    return NextResponse.next();
  }
  
  // Check for authentication token
  // In a real implementation, this would validate the JWT token
  const token = request.cookies.get('auth-token')?.value;
  
  if (!token && !pathname.includes('_next') && !pathname.includes('api')) {
    // Redirect to login page if not authenticated
    const url = request.nextUrl.clone();
    url.pathname = '/auth/signin';
    url.search = `?redirect=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};