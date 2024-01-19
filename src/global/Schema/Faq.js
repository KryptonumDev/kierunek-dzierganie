import { MDXRemote } from 'next-mdx-remote/rsc';
// imported renderToStaticMarkup from different location because of issue in Next.js 14. Learn more: https://github.com/vercel/next.js/discussions/58305
import { renderToStaticMarkup } from 'next/dist/compiled/react-dom/cjs/react-dom-server-legacy.browser.development';

const SchemaFaq = async ({ list }) => {
  list = await Promise.all(
    list.map(async ({ question, answer }) => ({
      question: await MDXRemote({ source: question }),
      answer: await MDXRemote({ source: answer }),
    }))
  );
  
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: list.map(({ question, answer }) => {
      return {
        '@type': 'Question',
        name: renderToStaticMarkup(question),
        acceptedAnswer: {
          '@type': 'Answer',
          text: renderToStaticMarkup(answer),
        },
      };
    }),
  };
  
  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export default SchemaFaq;