import { notFound } from 'next/navigation';
import sanityFetch from '@/utils/sanity.fetch';
import Seo, { Seo_Query } from '@/global/Seo';
import type { PageQueryProps } from '@/global/types';

const NotFoundPage = () => {
  notFound();
};

export default NotFoundPage;

export async function generateMetadata() {
  const {
    seo: { title, description },
  } = await query();
  return Seo({
    title,
    description,
    path: '/404',
  });
}

const query = async (): Promise<PageQueryProps> => {
  const data = await sanityFetch({
    query: /* groq */ `
      *[_type == "NotFound_Page"][0] {
        ${Seo_Query}
      }
    `,
  });
  return data as PageQueryProps;
};
