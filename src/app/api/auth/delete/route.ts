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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if(!user) return NextResponse.json({ success: false, error: 'No user found' }, { status: 404 });

  try {
    const res = await adminClient.auth.admin.deleteUser(user.id);

    if (res.error) throw new Error(res.error.message);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({success: false, error}, { status: 500 });
  }
}
