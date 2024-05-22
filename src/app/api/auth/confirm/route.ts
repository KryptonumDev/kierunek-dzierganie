import { createClient } from '@/utils/supabase-server';
import { type AuthError } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const backRoute = requestUrl.searchParams.get('backRoute');

  if (code) {
    try {
      const supabase = createClient();
      const response = await supabase.auth.exchangeCodeForSession(code);

      if (response.error) {
        return NextResponse.redirect(
          `https://kierunekdzierganie.pl/moje-konto/kursy?error_code=${response.error.code}&error_description=${response.error.message}&error_detail=${response.error.status}`
        );
      }

      if (backRoute) {
        return NextResponse.redirect(`https://kierunekdzierganie.pl${backRoute}`);
      }

      // URL to redirect to after sign in process completes
      return NextResponse.redirect('https://kierunekdzierganie.pl/moje-konto/kursy');
    } catch (error) {
      const typedError = error as AuthError;
      console.error(typedError);

      const message =
        typedError.code === 'bad_code_verifier'
          ? 'Proszę aktywować link w tej samej przeglądarce z której wysłałeś zapytanie!'
          : typedError.code === 'flow_state_not_found'
            ? 'Czas na aktywację linku wygasł! Proszę spróbować ponownie.'
            : typedError.message;

      return NextResponse.redirect(`https://kierunekdzierganie.pl/moje-konto/kursy?error_description=${message}`);
    }
  } else {
    console.log('No code provided! ', request);
    return NextResponse.redirect('https://kierunekdzierganie.pl/moje-konto/autoryzacja?error_decr=Błąd+podczas+autoryzacji!+Proszę+spróbować+ponownie.');
  }
}
