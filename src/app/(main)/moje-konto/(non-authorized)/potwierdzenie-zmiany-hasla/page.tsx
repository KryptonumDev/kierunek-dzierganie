import SuccessPasswordChange from '@/components/_dashboard/SuccessPasswordChange';
import Seo from '@/global/Seo';

const SuccessPasswordChangePage = async () => {
  return <SuccessPasswordChange />;
};

export async function generateMetadata() {
  return Seo({
    title: 'Hasło pomyślnie zmienione | Kierunek dzierganie',
    path: '/moje-konto/potwierdzenie-zmiany-hasla',
  });
}

export default SuccessPasswordChangePage;
