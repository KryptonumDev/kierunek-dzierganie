import PasswordChangeEmail from '@/components/_dashboard/PasswordChangeEmail';
import Breadcrumbs from '@/components/_global/Breadcrumbs';
import { QueryMetadata } from '@/global/Seo/query-metadata';

const currentUrl = '/moje-konto/przypomnij-haslo';
const page = [{ name: 'Przypomnij hasło', path: currentUrl }];

const PasswordChangePage = async () => {
  return (
    <>
      <Breadcrumbs data={page} />
      <PasswordChangeEmail />
    </>
  );
};

export async function generateMetadata() {
  return await QueryMetadata('ResetPassword_Page', currentUrl);
}

export default PasswordChangePage;
