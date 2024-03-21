import sanityFetch from '@/utils/sanity.fetch';
import Markdown from '@/components/ui/markdown';
import styles from './ContactForm.module.scss';
import type { Props } from './ContactForm.types';
import type { QueryProps } from './ContactForm.types';
import { urlWithoutProtocol } from '@/utils/url-without-protocool';
import CopyToClipboard from '@/components/ui/CopyToClipboard';
import Form from './_Form';

const ContactForm = async ({ heading, paragraph, aboveTheFold }: Props) => {
  const { email, tel, messenger } = await query();

  return (
    <section className={styles['ContactForm']}>
      <header>
        <Markdown.h2>{heading}</Markdown.h2>
        {paragraph && <Markdown className={styles.paragraph}>{paragraph}</Markdown>}
        <div className={styles.links}>
          <p>
            <a
              href={`mailto:${email}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              {email}
            </a>
            <CopyToClipboard copy={email} />
          </p>
          <p>
            <a
              href={`tel:${tel}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              {tel}
            </a>
            <CopyToClipboard copy={tel} />
          </p>
          <p>
            <a
              href={messenger}
              target='_blank'
              rel='noopener noreferrer'
            >
              {urlWithoutProtocol(messenger)}
            </a>
            <CopyToClipboard copy={messenger} />
          </p>
        </div>
      </header>
      <Form aboveTheFold={aboveTheFold} />
    </section>
  );
};

export default ContactForm;

const query = async (): Promise<QueryProps> => {
  const data = await sanityFetch({
    query: /* groq */ `
      *[_id == "global"][0]{
        email,
        tel,
        messenger,
      }
    `,
    tags: ['global'],
  });
  return data as QueryProps;
};
