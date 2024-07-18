import Breadcrumbs from '@/components/_global/Breadcrumbs';
import StanVouchera from '@/components/_global/StanVouchera';
import { QueryMetadata } from '@/global/Seo/query-metadata';

const currentUrl = '/stanvouchera';
const page = [{ name: 'Stan vouchera', path: currentUrl }];

const StanVoucherPage = async () => {
  return (
    <>
      <Breadcrumbs data={page} />
      <StanVouchera />
    </>
  );
};

export async function generateMetadata() {
  return await QueryMetadata('StanVouchera_Page', currentUrl);
}

export default StanVoucherPage;
