import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Create a Supabase client configured to use cookies
  const supabase = createMiddlewareClient({ req, res });

  // Refresh session if expired - required for Server Components
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (
    !user &&
    req.nextUrl.pathname.includes('/moje-konto') &&
    !req.nextUrl.pathname.includes('autoryzacja') &&
    !req.nextUrl.pathname.includes('wylogowano')
  )
    return NextResponse.redirect(new URL('/moje-konto/autoryzacja', req.url));

  if (user && req.nextUrl.pathname.includes('autoryzacja'))
    return NextResponse.redirect(new URL('/moje-konto/kursy', req.url));

  if (user && req.nextUrl.pathname === '/moje-konto')
    return NextResponse.redirect(new URL('/moje-konto/kursy', req.url));

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
