import UserData from '@/components/_dashboard/UserData';
import type { QueryProps } from '@/components/_dashboard/UserData/UserData.types';
import Breadcrumbs from '@/components/_global/Breadcrumbs';
import { QueryMetadata } from '@/global/Seo/query-metadata';
import { createClient } from '@/utils/supabase-server';

const currentUrl = '/moje-konto/dane';
const page = [{ name: 'Moje dane', path: currentUrl }];

const MyDataPage = async () => {
  const data: QueryProps = await query();

  return (
    <>
      <Breadcrumbs
        visible={false}
        data={page}
      />
      <UserData data={data} />
    </>
  );
};

export async function generateMetadata() {
  return await QueryMetadata('Data_Page', currentUrl);
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

  return { ...data, email: user!.email! };
};
