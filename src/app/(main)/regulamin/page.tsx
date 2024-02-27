import { draftMode } from 'next/headers';
import Breadcrumbs from '@/components/_global/Breadcrumbs';
import Contents from '@/components/_legal/Contents';
import FilesComponent, { FilesComponent_Query } from '@/components/_legal/FilesComponent';
import Header from '@/components/_legal/Header';
import sanityFetch from '@/utils/sanity.fetch';
import { Header_Query } from '@/components/_legal/Header';
import { Contents_Query } from '@/components/_legal/Contents';
import Seo, { Seo_Query } from '@/global/Seo';
import { type StatutePageQueryProps } from '@/global/types';

const page = { name: 'Regulamin', path: '/regulamin' };

export default async function StatutePage() {
  const {
    global: { tel, email },
    page: { content, header_Description, header_Heading, files },
  }: StatutePageQueryProps = await getData();

  return (
    <>
      <Breadcrumbs data={[page]} />
      <Header data={{ header_Heading, header_Description, tel, email }} />
      <Contents data={content} />
      <FilesComponent data={files} />
    </>
  );
}

export async function generateMetadata() {
  const {
    page: {
      seo: { title, description },
    },
  } = await getData();
  return Seo({
    title,
    description,
    path: page.path,
  });
}

async function getData() {
  const data = await sanityFetch<StatutePageQueryProps>({
    query: /* groq */ `
      {
        'global': *[_id == 'global'][0] {
          tel,
          email
        },
        'page': *[_id=='Statute_Page'][0] {
          ${Header_Query}
          ${Contents_Query}
          ${FilesComponent_Query}
          ${Seo_Query}
        }
      }
    `,
    isDraftMode: draftMode().isEnabled,
  });
  return data;
}
