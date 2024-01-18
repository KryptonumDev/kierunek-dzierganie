import ReactMarkdown from 'react-markdown';
import { renderToStaticMarkup } from 'react-dom/server';

const SchemaFaq = ({ data }) => {
  const schama = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": data.map(({ question, answer }) => {
      return {
        "@type": "Question",
        "name": renderToStaticMarkup(<ReactMarkdown>{question}</ReactMarkdown>),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": renderToStaticMarkup(<ReactMarkdown>{answer}</ReactMarkdown>)
        }
      };
    })
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schama) }}
    />
  );
};

export default SchemaFaq;