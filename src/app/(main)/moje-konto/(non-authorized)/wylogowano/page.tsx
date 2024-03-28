import sanityFetch from '@/utils/sanity.fetch';
import { QueryMetadata } from '@/global/Seo/query-metadata';
import Breadcrumbs from '@/components/_global/Breadcrumbs';
import Components, { Components_Query } from '@/components/Components';
import type { PageQueryProps } from '@/global/types';

const currentUrl = '/moje-konto/wylogowano';
const page = [
  { name: 'Moje konto', path: '/moje-konto' },
  { name: 'Wylogowano', path: currentUrl },
];

export default async function LogoutPage() {
  const { content }: PageQueryProps = await query();

  return (
    <>
      <Breadcrumbs data={page} />
      <Components data={content} />
    </>
  );
}

export async function generateMetadata() {
  return await QueryMetadata('Logout_Page', currentUrl);
}

const query = async (): Promise<PageQueryProps> => {
  return await sanityFetch<PageQueryProps>({
    query: /* groq */ `
      *[_type == "Logout_Page"][0] {
        ${Components_Query}
      }
    `,
    tags: ['Logout_Page'],
  });
};
