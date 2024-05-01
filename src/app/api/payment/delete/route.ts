'use server';
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase-admin';

export async function POST(request: Request) {
  const supabase = createClient();
  try {
    const { id } = await request.json();

    const { error } = await supabase
      .from('orders')
      .update({
        status: 5,
      })
      .eq('id', id);

    if (error) throw new Error(error.message);

    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
