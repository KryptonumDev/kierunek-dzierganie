import sanityFetch from '@/utils/sanity.fetch';
import Markdown from '@/components/ui/markdown';
import styles from './ContactForm.module.scss';
import CopyToClipboard from '@/components/ui/CopyToClipboard';
import Form from './_Form';
import type { Props } from './ContactForm.types';
import type { QueryProps } from './ContactForm.types';

const ContactForm = async ({ heading, paragraph, aboveTheFold }: Props) => {
  const { email, tel, messenger, email_orders, email_support } = await query();

  // tematy wiadomości
  const emails = [{ label: 'Obsługa sklepu', value: email }];
  if (email_orders) emails.push({ label: 'Wysyłki i zamówienia', value: email_orders });
  if (email_support) emails.push({ label: 'Kwestie techniczne', value: email_support });
  emails.push({ label: 'Inne', value: email + ' ' });

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
          {email_orders && (
            <div>
              Wysyłki i zamówienia <br />
              <p>
                <a
                  href={`mailto:${email_orders}`}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  {email_orders}
                </a>
                <CopyToClipboard copy={email_orders} />
              </p>
            </div>
          )}
          {email_support && (
            <div>
              Kwestie techniczne związane z kursami lub dostępem do konta <br />
              <p>
                <a
                  href={`mailto:${email_support}`}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  {email_support}
                </a>
                <CopyToClipboard copy={email_support} />
              </p>
            </div>
          )}
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
              Messenger (m.me)
            </a>
            <CopyToClipboard copy={messenger} />
          </p>
        </div>
      </header>
      <Form
        emails={emails}
        aboveTheFold={aboveTheFold}
      />
    </section>
  );
};

export default ContactForm;

const query = async (): Promise<QueryProps> => {
  const data = await sanityFetch({
    query: /* groq */ `
      *[_id == "global"][0]{
        email,
        email_orders,
        email_support,
        tel,
        messenger,
      }
    `,
    tags: ['global'],
  });
  return data as QueryProps;
};
