import { draftMode } from 'next/headers';
import Breadcrumbs from '@/components/_global/Breadcrumbs';
import Contents from '@/components/_legal/Contents';
import FilesComponent, { FilesComponent_Query } from '@/components/_legal/FilesComponent';
import Header from '@/components/_legal/Header';
import { StatutePageQueryProps } from '@/global/types';
import sanityFetch from '@/utils/sanity.fetch';
import { Header_Query } from '@/components/_legal/Header';
import { Contents_Query } from '@/components/_legal/Contents';
import Seo, { Seo_Query } from '@/global/Seo';

const page = { name: 'Regulamin', path: '/regulamin' };

export default async function StatutePage() {
  const {
    global: { tel, email },
    statute_page: { Content, Header_Description, Header_Heading, Files },
  }: StatutePageQueryProps = await getData();

  return (
    <>
      <Breadcrumbs data={[page]} />
      <Header data={{ Header_Heading, Header_Description, tel, email }} />
      <Contents data={Content} />
      <FilesComponent data={Files} />
    </>
  );
}

export async function generateMetadata() {
  const {
    statute_page: {
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
      'statute_page': *[_id=='Statute_Page'][0] {
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
