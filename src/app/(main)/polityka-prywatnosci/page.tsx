import { draftMode } from 'next/headers';
import sanityFetch from '@/utils/sanity.fetch';
import Breadcrumbs from '@/components/_global/Breadcrumbs';
import Header, { Header_Query } from '@/components/_legal/Header';
import Contents, { Contents_Query } from '@/components/_legal/Contents';
import Seo, { Seo_Query } from '@/global/Seo';
import { type PrivacyPolicyPage } from '@/global/types';

const page = { name: 'Polityka prywatności', path: '/polityka-prywatnosci' };

export default async function PrivacyPolicyPage() {
  const { content, header_Description, header_Heading } = await getData();

  return (
    <>
      <Breadcrumbs data={[page]} />
      <Header data={{ header_Heading, header_Description }} />
      <Contents
        data={content}
        isPrivacyPolicy={true}
      />
    </>
  );
}

export async function generateMetadata() {
  const {
    seo: { title, description },
  } = await getData();
  return Seo({
    title,
    description,
    path: page.path,
  });
}

async function getData() {
  const data = await sanityFetch<PrivacyPolicyPage>({
    query: /* groq */ `
      *[_id=='PrivacyPolicy_Page'][0] {
        ${Header_Query}
        ${Contents_Query}
        ${Seo_Query}
      }
    `,
    isDraftMode: draftMode().isEnabled,
  });
  return data;
}
