'use server';

import type { Billing, Shipping } from '@/global/types';
import { createClient } from '@/utils/supabase-server';

export type UserHeaderData = {
  userId?: string;
  userEmail?: string;
  shipping?: Shipping;
  billing?: Billing;
  virtualWallet: number;
  ownedCourses?: string[];
};

export async function getUserHeaderData(): Promise<UserHeaderData> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { virtualWallet: 0 };
  }

  const { data } = await supabase
    .from('profiles')
    .select(
      `
        id,
        billing_data,
        shipping_data,
        courses_progress (
          course_id
        )
      `
    )
    .eq('id', user.id)
    .single();

  // Fetch virtual wallet balance using RPC function
  const { data: balance } = await supabase.rpc('get_available_balance', { user_id: user.id });

  return {
    userId: user.id,
    userEmail: user.email,
    shipping: data?.shipping_data as Shipping | undefined,
    billing: data?.billing_data as Billing | undefined,
    virtualWallet: balance ?? 0,
    ownedCourses: data?.courses_progress?.map((course: { course_id: string }) => course.course_id as string),
  };
}
