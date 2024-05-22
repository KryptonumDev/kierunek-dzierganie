import sanityFetch from '@/utils/sanity.fetch';
import Components, { Components_Query } from '@/components/Components';
import type { PageQueryProps } from '@/global/types';

const NotFoundPage = async () => {
  const { content }: PageQueryProps = await query();

  return (
    <>
      <Components data={content} />
    </>
  );
};

export default NotFoundPage;

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
