import SuccessPasswordChange from '@/components/_dashboard/SuccessPasswordChange';
import Breadcrumbs from '@/components/_global/Breadcrumbs';
import { QueryMetadata } from '@/global/Seo/query-metadata';

const currentUrl = '/moje-konto/potwierdzenie-zmiany-hasla';
const page = [{ name: 'Potwierdzenie zmiany hasła', path: currentUrl }];

const SuccessPasswordChangePage = async () => {
  return (
    <>
      <Breadcrumbs data={page} />
      <SuccessPasswordChange />
    </>
  );
};

export async function generateMetadata() {
  return await QueryMetadata('ChangePasswordSuccess_Page', currentUrl);
}

export default SuccessPasswordChangePage;
