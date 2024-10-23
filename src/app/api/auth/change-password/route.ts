import { createClient } from '@/utils/supabase-server';
import { type EmailOtpType } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  const type = searchParams.get('type') as EmailOtpType | null;

  if (token && type) {
    const supabase = createClient();

    const res = await supabase.auth.verifyOtp({
      type,
      token_hash: token,
    });
    const { error } = res;
    if (error) {
      return NextResponse.json(error);
    }

    return NextResponse.json(res);
  }

  const error = searchParams.get('error_description');

  return NextResponse.json(error);
}
