import { createClient } from '@/utils/supabase-server';
import { type EmailOtpType } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('next') ?? 'https://kierunekdzierganie.pl/';

  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = next;
  redirectTo.searchParams.delete('token');
  redirectTo.searchParams.delete('type');

  if (token && type) {
    const supabase = createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: token,
    });

    if (error) {
      redirectTo.searchParams.delete('next');
      redirectTo.pathname = '/moje-konto/autoryzacja';
      redirectTo.searchParams.append('error_description', error.message.replace(/ /g, '+'));
      return NextResponse.redirect(redirectTo);
    }

    redirectTo.searchParams.delete('next');
    return NextResponse.redirect(redirectTo);
  }

  console.log('No code provided! ', request);
  const error = searchParams.get('error_description');

  const message =
    error === 'Email link is invalid or has expired'
      ? 'Link jest nieprawidłowy lub wygasł! Proszę spróbować ponownie.'
      : error ?? 'Błąd podczas autoryzacji! Proszę spróbować ponownie.';

  // return the user to an error page with some instructions
  redirectTo.pathname = '/moje-konto/autoryzacja';
  redirectTo.searchParams.append('error_description', message.replace(/ /g, '+'));
  return NextResponse.redirect(redirectTo);
}
