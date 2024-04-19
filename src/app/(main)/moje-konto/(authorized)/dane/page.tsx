import UserData from '@/components/_dashboard/UserData';
import type { QueryProps } from '@/components/_dashboard/UserData/UserData.types';
import Seo from '@/global/Seo';
import { createClient } from '@/utils/supabase-server';

const MyDataPage = async () => {
  const data: QueryProps = await query();

  return <UserData data={data} />;
};

export async function generateMetadata() {
  return Seo({
    title: 'Moje dane | Kierunek dzierganie',
    path: '/moje-konto/dane',
  });
}

export default MyDataPage;

const query = async (): Promise<QueryProps> => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from('profiles')
    .select(
      `
        id,
        left_handed,
        billing_data,
        avatar_url
      `
    )
    .eq('id', user!.id)
    .single();

  if (!data) throw new Error('No data found');

  return {...data, email: user!.email!};
};
