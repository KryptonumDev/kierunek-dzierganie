'use server';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export async function POST(request: Request) {
  console.log(request);
  const user = '0a8aec83-2927-42ae-9724-4928d98d1b29';
  const products = { id: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed', quantity: 1 };

  const { data, error } = await supabase.from('orders').insert({ user_id: user, products: products });
  if(error) NextResponse.json(error);
  return NextResponse.json({ data, error });
}
