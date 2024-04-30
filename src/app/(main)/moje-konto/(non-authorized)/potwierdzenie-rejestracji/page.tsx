import SuccessRegistration from '@/components/_dashboard/SuccessRegistration';
import Breadcrumbs from '@/components/_global/Breadcrumbs';
import { QueryMetadata } from '@/global/Seo/query-metadata';

const currentUrl = '/moje-konto/potwierdzenie-rejestracji';
const page = [{ name: 'Potwierdzenie rejestracji', path: currentUrl }];

const SuccessRegistrationPage = async () => {
  return (
    <>
      <Breadcrumbs data={page} />
      <SuccessRegistration />
    </>
  );
};

export async function generateMetadata() {
  return await QueryMetadata('RegisterSuccess_Page', currentUrl);
}

export default SuccessRegistrationPage;
