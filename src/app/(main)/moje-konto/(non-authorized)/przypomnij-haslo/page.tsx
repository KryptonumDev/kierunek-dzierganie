import PasswordChangeEmail from '@/components/_dashboard/PasswordChangeEmail';
import Seo from '@/global/Seo';

const PasswordChangePage = async () => {
  return <PasswordChangeEmail />;
};

export async function generateMetadata() {
  return Seo({
    title: 'Przypomnij hasło | Kierunek dzierganie',
    path: '/moje-konto/przypomnij-haslo',
  });
}

export default PasswordChangePage;
