import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateRandomCode } from '@/utils/generate-random-code';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    const { error } = await supabase.from('coupons').insert({
      description: 'Affiliate',
      type: 2,
      code: generateRandomCode(),
      per_user_limit: 1,
      affiliation_of: userId,
      state: 2,
      amount: 5000,
    });

    const { error: error2 } = await supabase.from('virtual_wallet').insert({
      owner: userId,
      amount: 0,
    });

    if (error) throw new Error(error.message);
    if (error2) throw new Error(error2.message);

    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
