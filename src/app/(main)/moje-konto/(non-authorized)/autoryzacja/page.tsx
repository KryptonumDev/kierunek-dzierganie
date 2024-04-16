import Authorization from '@/components/_dashboard/TemporaryAuthorization/authorization';
import Seo from '@/global/Seo';

const AuthorizationPage = async () => {
  return <Authorization />;
};

export async function generateMetadata() {
  return Seo({
    title: 'Autoryzacja | Kierunek dzierganie',
    path: '/moje-konto/autoryzacja',
  });
}

export default AuthorizationPage;
