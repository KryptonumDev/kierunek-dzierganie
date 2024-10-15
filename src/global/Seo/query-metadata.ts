import Seo from '@/global/Seo';
import sanityFetch from '@/utils/sanity.fetch';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

type QueryType = {
  title: string;
  description: string;
  img?: string;
  visible: boolean | null;
};

/**
 * Performs a SEO query.
 * @param {string} name - The name of the SEO query for GROQ, it will be: `*[_id == "${name}"][0]` or `* [_type=='${name}' && slug.current == $slug][0]` if the `dynamicSlug` will be provided.
 * @param {string} path - The cannonical path for the URL.
 * @param {string} [dynamicSlug] - Optional. Used to query dynamic pages, like blog posts.
 * @returns {Promise<Metadata>} Returns a promise of the SEO object.
 */
export const QueryMetadata = async (name: string | string[], path: string, dynamicSlug?: string): Promise<Metadata> => {
  if (typeof name === 'string') {
    name = [name];
  }

  const stringQuery = name.map((el) => `_type == '${el}'`).join(' || ');

  const customQuery = dynamicSlug ? `*[(${stringQuery}) && slug.current == $slug][0]` : `*[(${stringQuery})][0]`;

  const { title, description, img, visible } = await query(customQuery, name, dynamicSlug);

  return Seo({
    title,
    description,
    path: path,
    img,
    visible: !visible,
  });
};

const query = async (customQuery: string, tag: string[], dynamicSlug?: string): Promise<QueryType> => {
  const seo = await sanityFetch<QueryType>({
    query: /* groq */ `
      ${customQuery} {
        visible,
        "title": seo.title,
        "description": seo.description,
        "img": seo.img.asset -> url + "?w=1200"
      }
    `,
    tags: tag,
    ...(dynamicSlug && { params: { slug: dynamicSlug } }),
  });
  console.log(seo);
  !seo && notFound();
  return { ...seo };
};
