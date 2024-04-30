import { createClient } from '@/utils/supabase-admin';
import { type NextRequest, NextResponse } from 'next/server';
import { type EmailOtpType } from '@supabase/supabase-js';

export async function GET(req: NextRequest) {

  const { searchParams } = new URL(req.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const backUrl = searchParams.get('backUrl') ?? '/moje-konto';

  const redirectTo = req.nextUrl.clone();
  redirectTo.pathname = backUrl;
  redirectTo.searchParams.delete('token_hash');
  redirectTo.searchParams.delete('type');

  if (token_hash && type) {
    const supabase = createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      redirectTo.searchParams.delete('backUrl');
      return NextResponse.redirect(new URL(backUrl, req.url));
    }
  }
}