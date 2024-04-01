import UserData from '@/components/_dashboard/UserData';
import type { QueryProps } from '@/components/_dashboard/UserData/UserData.types';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const MyDataPage = async () => {
  const data: QueryProps = await query();

  return <UserData data={data} />;
};

export default MyDataPage;

const query = async (): Promise<QueryProps> => {
  const supabase = createServerActionClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from('profiles')
    .select(
      `
        id,
        left_handed,
        email,
        billing_data,
        avatar_url
      `
    )
    .eq('id', user!.id)
    .single();

  if (!data) throw new Error('No data found');

  return data;
};
