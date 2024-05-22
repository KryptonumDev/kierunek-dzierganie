import sanityFetch from '@/utils/sanity.fetch';
import Components, { Components_Query } from '@/components/Components';
import { QueryMetadata } from '@/global/Seo/query-metadata';
import type { PageQueryProps } from '@/global/types';

export default async function NotFoundPage() {
  const { content }: PageQueryProps = await query();

  return (
    <>
      <Components data={content} />
    </>
  );
}

export async function generateMetadata() {
  return await QueryMetadata('NotFound_Page', '/404');
}

const query = async (): Promise<PageQueryProps> => {
  const data = await sanityFetch({
    query: /* groq */ `
      *[_type == "NotFound_Page"][0] {
        ${Components_Query}
      }
    `,
  });
  return data as PageQueryProps;
};
