import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const res = NextResponse.next();

  // Create a Supabase client configured to use cookies
  const supabase = createMiddlewareClient({ req, res });

  // Refresh session if expired - required for Server Components
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session && req.nextUrl.pathname.includes('/dashboard'))
    return NextResponse.redirect(new URL('/authorization', req.url));

  if (session && req.nextUrl.pathname.includes('/authorization'))
    return NextResponse.redirect(new URL('/dashboard/my-courses', req.url));

  if (session && req.nextUrl.pathname === '/dashboard')
    return NextResponse.redirect(new URL('/dashboard/my-courses', req.url));

  return res;
}

export const config = {
  /*
   * Match all request paths except for the ones starting with:
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   * Feel free to modify this pattern to include more paths.
   */
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
  // TODO: add include only dashboard routes
};
