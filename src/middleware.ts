import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from './utils/supabase-middleware';
import { type User } from '@supabase/supabase-js';

export async function middleware(req: NextRequest) {
  const { response, user }: { response: NextResponse; user: User | null } = await updateSession(req);

  if (
    !user &&
    !req.nextUrl.pathname.includes('/moje-konto/przypomnij-haslo') &&
    !req.nextUrl.pathname.includes('/moje-konto/ustaw-haslo') &&
    !req.nextUrl.pathname.includes('moje-konto/potwierdzenie-rejestracji') &&
    req.nextUrl.pathname.includes('/moje-konto') &&
    !req.nextUrl.pathname.includes('autoryzacja') &&
    !req.nextUrl.pathname.includes('wylogowano')
  )
    return NextResponse.redirect(new URL('/moje-konto/autoryzacja', req.url));

  if (user && req.nextUrl.pathname.includes('autoryzacja'))
    return NextResponse.redirect(new URL('/moje-konto/kursy', req.url));

  if (user && req.nextUrl.pathname === '/moje-konto')
    return NextResponse.redirect(new URL('/moje-konto/kursy', req.url));

  // update user session
  return response;
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
