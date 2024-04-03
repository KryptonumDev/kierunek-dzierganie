import PasswordChange from '@/components/_dashboard/PasswordChange';
import Seo from '@/global/Seo';

const PasswordChangePage = async () => {
  return <PasswordChange />;
};

export async function generateMetadata() {
  return Seo({
    title: 'Ustaw hasło | Kierunek dzierganie',
    path: '/moje-konto/ustaw-haslo',
  });
}

export default PasswordChangePage;
