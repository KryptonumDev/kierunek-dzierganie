import ReactMarkdown from 'react-markdown';
import { renderToStaticMarkup } from 'react-dom/server';

const SchemaFaq = ({ data }) => {
  const schama = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": data.map(item => {
      const question = renderToStaticMarkup(<ReactMarkdown>{item.question}</ReactMarkdown>);
      const answer = renderToStaticMarkup(<ReactMarkdown>{item.answer}</ReactMarkdown>);
      return {
        "@type": "Question",
        "name": question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": answer
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
