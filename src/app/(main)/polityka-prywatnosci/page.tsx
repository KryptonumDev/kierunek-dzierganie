import sanityFetch from '@/utils/sanity.fetch';
import { QueryMetadata } from '@/global/Seo/query-metadata';
import Breadcrumbs from '@/components/_global/Breadcrumbs';
import Header, { Header_Query } from '@/components/_legal/Header';
import Contents, { Contents_Query } from '@/components/_legal/Contents';
import type { PrivacyPolicyPage_QueryTypes } from './page.types';

const page = { name: 'Polityka prywatności', path: '/polityka-prywatnosci' };

export default async function PrivacyPolicyPage() {
  const { content, header_Description, header_Heading } = await getData();

  return (
    <>
      <Breadcrumbs data={[page]} />
      <Header
        {...{
          heading: header_Heading,
          description: header_Description,
        }}
      />
      <Contents
        data={content}
        isPrivacyPolicy={true}
      />
    </>
  );
}

async function getData(): Promise<PrivacyPolicyPage_QueryTypes> {
  return await sanityFetch<PrivacyPolicyPage_QueryTypes>({
    query: /* groq */ `
      *[_id == 'PrivacyPolicy_Page'][0] {
        ${Header_Query}
        ${Contents_Query}
      }
    `,
    tags: ['PrivacyPolicy_Page'],
  });
}

export async function generateMetadata() {
  return await QueryMetadata('PrivacyPolicy_Page', page.path);
}
