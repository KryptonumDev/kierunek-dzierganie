import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const adminClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });
  const code = '47e187f8-b579-47f4-af96-af157519cbbb';

  const res = await adminClient.auth.admin.deleteUser(code);
  console.log(res);

  supabase.auth.signOut();

  return NextResponse.json({ code, res });
}
