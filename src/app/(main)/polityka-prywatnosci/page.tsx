import sanityFetch from '@/utils/sanity.fetch';
import { QueryMetadata } from '@/global/Seo/query-metadata';
import Breadcrumbs from '@/components/_global/Breadcrumbs';
import Header, { Header_Query } from '@/components/_legal/Header';
import Contents, { Contents_Query } from '@/components/_legal/Contents';
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
  return await QueryMetadata('PrivacyPolicy_Page', `${page.path}`);
}

async function getData(): Promise<PrivacyPolicyPage> {
  return await sanityFetch<PrivacyPolicyPage>({
    query: /* groq */ `
      *[_id == 'PrivacyPolicy_Page'][0] {
        ${Header_Query}
        ${Contents_Query}
      }
    `,
    tags: ['PrivacyPolicy_Page'],
  });
}
