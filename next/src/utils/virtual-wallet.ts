import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Get the available balance for a user, excluding expired credits.
 * Uses the get_available_balance SQL function.
 */
export async function getAvailableBalance(supabase: SupabaseClient, userId: string): Promise<number> {
  const { data, error } = await supabase.rpc('get_available_balance', { user_id: userId });
  if (error) throw error;
  return data ?? 0;
}

/**
 * Add loyalty points (credits) to a user's virtual wallet.
 * Points will expire 1 year from now.
 */
export async function addPoints(
  supabase: SupabaseClient,
  userId: string,
  amount: number,
  description: string,
  orderId?: number
): Promise<void> {
  const expiresAt = new Date();
  expiresAt.setFullYear(expiresAt.getFullYear() + 1);

  const { error } = await supabase.from('virtual_wallet_transactions').insert({
    owner_id: userId,
    amount,
    transaction_type: 'credit',
    expires_at: expiresAt.toISOString(),
    description,
    order_id: orderId ?? null,
  });

  if (error) throw error;
}

/**
 * Spend loyalty points (debit) from a user's virtual wallet.
 * Creates a debit transaction record.
 */
export async function spendPoints(
  supabase: SupabaseClient,
  userId: string,
  amount: number,
  orderId: number
): Promise<void> {
  const { error } = await supabase.from('virtual_wallet_transactions').insert({
    owner_id: userId,
    amount: -Math.abs(amount),
    transaction_type: 'debit',
    expires_at: null,
    description: `Wykorzystano przy zamówieniu #${orderId}`,
    order_id: orderId,
  });

  if (error) throw error;
}
