import sanityFetch from '@/utils/sanity.fetch';
import Header from '@/components/_legal/Header';
import { QueryMetadata } from '@/global/Seo/query-metadata';
import Breadcrumbs from '@/components/_global/Breadcrumbs';
import Contents from '@/components/_legal/Contents';
import FilesComponent, { FilesComponent_Query } from '@/components/_legal/FilesComponent';
import { Header_Query } from '@/components/_legal/Header';
import { Contents_Query } from '@/components/_legal/Contents';
import type { StatutePage_QueryTypes } from './page.types';

const page = { name: 'Regulamin', path: '/regulamin' };

export default async function StatutePage() {
  const {
    global: { tel, email },
    page: { content, header_Description, header_Heading, files },
  } = await getData();

  return (
    <>
      <Breadcrumbs data={[page]} />
      <Header
        {...{
          heading: header_Heading,
          description: header_Description,
          tel,
          email,
        }}
      />
      <Contents data={content} />
      <FilesComponent data={files} />
    </>
  );
}

async function getData(): Promise<StatutePage_QueryTypes> {
  return await sanityFetch<StatutePage_QueryTypes>({
    query: /* groq */ `
      {
        "global": *[_id == 'global'][0] {
          tel,
          email
        },
        "page": *[_id=='Statute_Page'][0] {
          ${Header_Query}
          ${Contents_Query}
          ${FilesComponent_Query}
        }
      }
    `,
    tags: ['Statute_Page','global'],
  });
}

export async function generateMetadata() {
  return await QueryMetadata('Statute_Page', page.path);
}
