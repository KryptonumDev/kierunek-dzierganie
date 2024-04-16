import Markdown from '@/components/ui/markdown';
import sanityFetch from '@/utils/sanity.fetch';
import styles from './CookieConsent.module.scss';
import Content from './_Content';
import type { QueryType } from './CookieConsent.types';

export default async function CookieConsent() {
  let { CookieConsent } = await query();
  CookieConsent = {
    ...CookieConsent,
    heading: <Markdown.h2>{CookieConsent.heading as string}</Markdown.h2>,
    paragraph: <Markdown className={styles.paragraph}>{CookieConsent.paragraph as string}</Markdown>,
    details: {
      ...CookieConsent.details,
      heading: <Markdown.h3>{CookieConsent.details.heading as string}</Markdown.h3>,
      paragraph: <Markdown className={styles.paragraph}>{CookieConsent.details.paragraph as string}</Markdown>,
    },
  };

  return (
    <aside className={styles['CookieConsent']}>
      <Content
        CloseIcon={CloseIcon}
        {...CookieConsent}
      />
    </aside>
  );
}

const CloseIcon = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={32}
    height={33}
    fill='none'
  >
    <path
      d='m23 23.233-14-14m14 0-14 14'
      stroke='#9A827A'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

const query = async (): Promise<QueryType> => {
  return await sanityFetch<QueryType>({
    query: /* groq */ `
      *[_type == "global"][0]{
        CookieConsent {
          heading,
          paragraph,
          details {
            heading,
            paragraph,
            necessary[] {
              service,
              cookies[] {
                name,
                description,
                expiry,
                type,
              },
            },
            necessary_Description,
            preferences[] {
              service,
              cookies[] {
                name,
                description,
                expiry,
                type,
              },
            },
            preferences_Description,
            statistical[] {
              service,
              cookies[] {
                name,
                description,
                expiry,
                type,
              },
            },
            statistical_Description,
            marketing[] {
              service,
              cookies[] {
                name,
                description,
                expiry,
                type,
              },
            },
            marketing_Description,
            unclassified[] {
              service,
              cookies[] {
                name,
                description,
                expiry,
                type,
              },
            },
            unclassified_Description,
          },
        },
      }
    `,
    tags: ['global'],
  });
};
