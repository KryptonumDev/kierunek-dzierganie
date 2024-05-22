'use server';

import { createClient } from './supabase-server';

export default async function getUserData(query: string) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase.from('profiles').select(query).eq('id', user?.id).single();

  return data;
}
