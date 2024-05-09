import Script from 'next/script';
import { removeMarkdown } from '@/utils/remove-markdown';
import { type BlogPostQueryProps } from '../types';
import { DOMAIN } from '../constants';

export default async function ArticleSchema({
  hero: { heading, paragraph },
  date,
  author,
  OrganizationData: { OrganizationSchema },
}: {
  hero: BlogPostQueryProps['hero'];
  date: string;
  author: BlogPostQueryProps['author'];
  OrganizationData: BlogPostQueryProps['OrganizationData'];
}) {
  return (
    <Script
      id='json-ld-article'
      type='application/ld+json'
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          ...(heading && { headline: removeMarkdown(heading) }),
          ...(heading && { name: removeMarkdown(heading) }),
          ...(paragraph && { description: removeMarkdown(paragraph) }),
          ...(date && { datePublished: date }),
          ...(author && {
            author: {
              '@type': 'Person',
              name: removeMarkdown(author.heading),
              image: {
                '@type': 'ImageObject',
                url: author.img?.asset.url,
              },
            },
          }),
          publisher: {
            '@type': 'Organization',
            '@id': { DOMAIN },
            ...(OrganizationSchema.name && { name: OrganizationSchema.name }),
            ...(OrganizationSchema.description && { description: OrganizationSchema.description }),
            logo: {
              '@type': 'ImageObject',
              url: `${DOMAIN}/kierunek-dzierganie-logo.png`,
            },
          },
        }),
      }}
    />
  );
}
