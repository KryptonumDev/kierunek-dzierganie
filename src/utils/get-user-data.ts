'use server';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export default async function getUserData(query: string){
  const supabase = createServerActionClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase.from('profiles').select(query).eq('id', user?.id).single();

  return data;
}