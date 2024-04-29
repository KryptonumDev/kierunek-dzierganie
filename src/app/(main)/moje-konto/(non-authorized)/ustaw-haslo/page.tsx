import PasswordChange from '@/components/_dashboard/PasswordChange';
import Breadcrumbs from '@/components/_global/Breadcrumbs';
import { QueryMetadata } from '@/global/Seo/query-metadata';

const currentUrl = '/moje-konto/ustaw-haslo';
const page = [{ name: 'Ustaw hasło', path: currentUrl }];

const PasswordChangePage = async () => {
  return (
    <>
      <Breadcrumbs data={page} />
      <PasswordChange />
    </>
  );
};

export async function generateMetadata() {
  return await QueryMetadata('SetPassword_Page', currentUrl);
}

export default PasswordChangePage;
