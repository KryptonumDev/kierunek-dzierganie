import { createClient } from '@/utils/supabase-server';
import { type EmailOtpType } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('next') ?? '/';

  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = next;
  redirectTo.searchParams.delete('token_hash');
  redirectTo.searchParams.delete('type');

  if (token_hash && type) {
    const supabase = createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (error) {
      const message =
        error.code === 'bad_code_verifier'
          ? 'Proszę aktywować link w tej samej przeglądarce z której wysłałeś zapytanie!'
          : error.code === 'flow_state_expired'
            ? 'Czas na aktywację linku wygasł! Proszę spróbować ponownie.'
            : error.code === 'flow_state_not_found'
              ? 'Brak informacji w ciasteczkach odnośnie zapytania, proszę skontaktować się z administracją.'
              : error.code === 'validation_failed'
                ? 'Brak informacji w ciasteczkach odnośnie zapytania, proszę skontaktować się z administracją.'
                : error.message ?? 'Błąd podczas autoryzacji! Proszę spróbować ponownie.';

      redirectTo.searchParams.delete('next');
      redirectTo.pathname = `/moje-konto/autoryzacja?error_description=${message.replace(/ /g, '+')}`;
      return NextResponse.redirect(redirectTo);
    }

    redirectTo.searchParams.delete('next');
    return NextResponse.redirect(redirectTo);
  }

  // return the user to an error page with some instructions
  redirectTo.pathname = '/error';
  return NextResponse.redirect('/moje-konto/autoryzacja?error_description=Brak+ważnego+tokena+autoryzacyjnego!');
}
