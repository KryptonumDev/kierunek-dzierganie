import SuccessRegistration from '@/components/_dashboard/SuccessRegistration';
import { notFound } from 'next/navigation';

const SuccessRegistrationPage = async ({
  searchParams: { provider },
}: {
  searchParams: { provider: string | undefined };
}) => {
  if (!provider) notFound();

  return <SuccessRegistration provider={provider} />;
};

export default SuccessRegistrationPage;
