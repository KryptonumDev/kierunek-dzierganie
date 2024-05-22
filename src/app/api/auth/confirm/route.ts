import { createClient } from '@/utils/supabase-server';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const backRoute = requestUrl.searchParams.get('backRoute');

  console.log(request);
  
  if (code) {
    const supabase = createClient();
    const res = await supabase.auth.exchangeCodeForSession(code);

    console.log('res', res);
  } 


  if(backRoute){
    return NextResponse.redirect(`https://kierunekdzierganie.pl${backRoute}`);
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect('https://kierunekdzierganie.pl/moje-konto/kursy');
}
