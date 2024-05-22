import { createClient } from '@/utils/supabase-admin';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if(!user) return NextResponse.json({ success: false, error: 'No user found' }, { status: 404 });

  try {
    const res = await supabase.auth.admin.deleteUser(user.id);

    if (res.error) throw new Error(res.error.message);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({success: false, error}, { status: 500 });
  }
}
