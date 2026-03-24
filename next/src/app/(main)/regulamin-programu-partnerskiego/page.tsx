import sanityFetch from '@/utils/sanity.fetch';
import Header from '@/components/_legal/Header';
import { QueryMetadata } from '@/global/Seo/query-metadata';
import Breadcrumbs from '@/components/_global/Breadcrumbs';
import Contents from '@/components/_legal/Contents';
import FilesComponent, { FilesComponent_Query } from '@/components/_legal/FilesComponent';
import { Header_Query } from '@/components/_legal/Header';
import { Contents_Query } from '@/components/_legal/Contents';
import type { PartnershipProgramPage_QueryTypes } from './page.types';
import { notFound } from 'next/navigation';

const page = { name: 'Regulamin programu partnerskiego', path: '/regulamin-programu-partnerskiego' };

export default async function PartnershipProgramPage() {
  const {
    global: { tel, email },
    page: { content, header_Description, header_Heading, files },
  } = await getData();

  if (!content || !header_Heading || !header_Description) {
    return notFound();
  }

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

async function getData(): Promise<PartnershipProgramPage_QueryTypes> {
  return await sanityFetch<PartnershipProgramPage_QueryTypes>({
    query: /* groq */ `
      {
        "global": *[_id == 'global'][0] {
          tel,
          email
        },
        "page": *[_id=='PartnershipProgram_Page'][0] {
          ${Header_Query}
          ${Contents_Query}
          ${FilesComponent_Query}
        }
      }
    `,
    tags: ['PartnershipProgram_Page', 'global'],
  });
}

export async function generateMetadata() {
  return await QueryMetadata('PartnershipProgram_Page', page.path);
}
