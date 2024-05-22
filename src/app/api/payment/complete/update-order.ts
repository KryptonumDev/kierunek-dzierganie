import { createClient } from '@/utils/supabase-admin';

export async function updateOrder (update: object, id: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('orders')
    .update(update)
    .eq('id', id)
    .select(
      `
        *
      `
    )
    .single();

  return { data, error };
}