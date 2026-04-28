import { createClient } from '@/utils/supabase-admin';
import { normalizeEmail } from '@/utils/normalize-email';
import { NextResponse } from 'next/server';

type RequestBody = {
  email?: string;
};

export async function POST(request: Request) {
  try {
    const { email } = (await request.json()) as RequestBody;
    const normalizedEmail = normalizeEmail(email ?? '');

    if (!normalizedEmail) {
      return NextResponse.json({ success: false, error: 'Adres e-mail jest wymagany.' }, { status: 400 });
    }

    const supabase = createClient();
    const { data, error } = await supabase.from('profiles').select('id').eq('email', normalizedEmail).maybeSingle();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      exists: Boolean(data),
    });
  } catch (error) {
    console.error('auth/check-email failed', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Nie udało się sprawdzić adresu e-mail. Spróbuj ponownie.',
      },
      { status: 500 }
    );
  }
}
