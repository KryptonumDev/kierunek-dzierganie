import Authorization from '@/components/_dashboard/TemporaryAuthorization/authorization';
import Breadcrumbs from '@/components/_global/Breadcrumbs';
import { QueryMetadata } from '@/global/Seo/query-metadata';

const currentUrl = '/moje-konto/autoryzacja';
const page = [{ name: 'Autoryzacja', path: currentUrl }];

const AuthorizationPage = async () => {
  return (
    <>
      <Breadcrumbs data={page} />
      <Authorization />
    </>
  );
};

export async function generateMetadata() {
  return await QueryMetadata('Authorization_Page', currentUrl);
}

export default AuthorizationPage;
