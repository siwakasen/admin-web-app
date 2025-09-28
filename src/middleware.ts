import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
export async function middleware(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  let decodedToken: {
    sub: string;
    type: string;
    jti: string;
    iat: number;
    exp: number;
  } | null = null;

  if (token) {
    decodedToken = jwtDecode(token);
  }

  if (
    token &&
    (request.nextUrl.pathname === '/' ||
      request.nextUrl.pathname.startsWith('/forget-password'))
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (
    !token &&
    request.nextUrl.pathname !== '/' &&
    !request.nextUrl.pathname.startsWith('/forget-password')
  ) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // check if the user is an owner and is trying to access pages for admin
  if (
    decodedToken?.type === 'o' &&
    (request.nextUrl.pathname.startsWith('/travel-packages') ||
      request.nextUrl.pathname.startsWith('/cars') ||
      request.nextUrl.pathname.startsWith('/expenses') ||
      request.nextUrl.pathname.startsWith('/bookings-adjustments') ||
      request.nextUrl.pathname.startsWith('/live-chat'))
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // check if the user is an admin and is trying to access pages for owner
  if (
    decodedToken?.type === 'e' &&
    (request.nextUrl.pathname.startsWith('/employees') ||
      request.nextUrl.pathname.startsWith('/refunds') ||
      request.nextUrl.pathname.startsWith('/reports') ||
      request.nextUrl.pathname.startsWith('/ratings'))
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/forget-password',
    '/forget-password/:path*',

    '/dashboard',
    '/bookings/:path*',

    '/cars/:path*',
    '/travel-packages/:path*',
    '/expenses/:path*',
    '/bookings-adjustments/:path*',
    '/live-chat/:path*',

    '/refunds/:path*',
    '/employees/:path*',
    '/reports/:path*',
    '/ratings/:path*',
  ],
};
