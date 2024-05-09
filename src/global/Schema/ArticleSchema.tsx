import Script from 'next/script';
import { removeMarkdown } from '@/utils/remove-markdown';

export default async function ArticleSchema({ heading }: { heading: string }) {
  return (
    <Script
      id='json-ld-article'
      type='application/ld+json'
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          ...(heading && { headline: removeMarkdown(heading) }),
        }),
      }}
    />
  );
}
