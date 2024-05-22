import { createClient } from '@/utils/supabase-server';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const backRoute = requestUrl.searchParams.get('backRoute');

  if (code) {
    const supabase = createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  if(backRoute){
    return NextResponse.redirect(`https://kierunek-dzierganie-git-beta-kryptonum.vercel.app${backRoute}`);
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect('https://kierunek-dzierganie-git-beta-kryptonum.vercel.app/moje-konto/kursy');
}
