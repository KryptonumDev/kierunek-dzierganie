import SuccessRegistration from '@/components/_dashboard/SuccessRegistration';
import Seo from '@/global/Seo';

const SuccessRegistrationPage = async () => {
  return <SuccessRegistration />;
};

export async function generateMetadata() {
  return Seo({
    title: 'Potwierdzenie rejestracji | Kierunek dzierganie',
    path: '/moje-konto/potwierdzenie-rejestracji',
  });
}

export default SuccessRegistrationPage;
