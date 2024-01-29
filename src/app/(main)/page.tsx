import { draftMode } from 'next/headers';
import sanityFetch from '@/utils/sanity.fetch';
import Seo from '@/global/Seo';
import type { generateMetadataProps } from '@/global/types';

const LandingPage = async () => {
  return (
    <h1>Homepage</h1>
  );
};

export async function generateMetadata() {
  const { seo: { title, description } } = (await query()) as generateMetadataProps;
  return Seo({
    title,
    description,
    path: '/',
  });
}

const query = async () => {
  const data = await sanityFetch({
    query: /* groq */ `
      *[_type == "landingPage"][0] {
        name,
        seo {
          title,
          description,
        }
      }`,
    isDraftMode: draftMode().isEnabled
  });
  return data;
};

export default LandingPage;