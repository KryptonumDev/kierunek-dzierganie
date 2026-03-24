import Components, { Components_Query } from '@/components/Components';
import Breadcrumbs from '@/components/_global/Breadcrumbs';
import { QueryMetadata } from '@/global/Seo/query-metadata';
import type { PageQueryProps } from '@/global/types';
import sanityFetch from '@/utils/sanity.fetch';
import type { Metadata } from 'next';

const page = { name: 'Dziękujemy za zamówienie', path: '/dziekujemy-za-zamowienie' };

const GuestThankYouPage = async () => {
  const { content }: PageQueryProps = await query();

  return (
    <>
      <Breadcrumbs data={[page]} />
      <Components data={content} />
    </>
  );
};

export default GuestThankYouPage;

export async function generateMetadata(): Promise<Metadata> {
  const metadata = await QueryMetadata('GuestThankYou_Page', page.path);

  // Override with noindex, nofollow for guest checkout page
  return {
    ...metadata,
    robots: {
      index: false,
      follow: false,
      noarchive: true,
      nosnippet: true,
      noimageindex: true,
    },
  };
}

const query = async (): Promise<PageQueryProps> => {
  const data = await sanityFetch({
    query: /* groq */ `
      *[_type == "GuestThankYou_Page"][0] {
        ${Components_Query}
      }
    `,
    tags: ['GuestThankYou_Page'],
  });
  return data as PageQueryProps;
};
