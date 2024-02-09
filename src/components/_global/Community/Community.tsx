import { draftMode } from 'next/headers';
import sanityFetch from '@/utils/sanity.fetch';
import Markdown from '@/components/ui/markdown';
import Button from '@/components/ui/Button';
import styles from './Community.module.scss';
import type { Props, QueryProps } from './Community.types';
import { Facebook, Instagram, Youtube } from '@/components/ui/Icons';

const Community = async ({ isHighlighted = false, heading, paragraph, cta }: Props) => {
  const { facebook, instagram, youtube }: QueryProps = await query();
  const socials = [
    {
      name: 'Facebook',
      url: facebook,
      icon: <Facebook />,
    },
    {
      name: 'Instagram',
      url: instagram,
      icon: <Instagram />,
    },
    {
      name: 'YouTube',
      url: youtube,
      icon: <Youtube />,
    },
  ];

  return (
    <section
      className={styles['Community']}
      data-highlighted={isHighlighted}
    >
      <header>
        <Markdown.h2>{heading}</Markdown.h2>
        <Markdown className={styles.paragraph}>{paragraph}</Markdown>
        {cta && (
          <Button
            data={cta}
            className={styles.cta}
          />
        )}
        <ul className={styles.socials}>
          {socials.map((social, i) => (
            <li key={i}>
              <a
                href={social.url}
                target='_blank'
                rel='noopener noreferrer'
                aria-label={social.name}
              >
                {social.icon}
              </a>
            </li>
          ))}
        </ul>
      </header>
    </section>
  );
};

export default Community;

const query = async (): Promise<QueryProps> => {
  const data = await sanityFetch({
    query: /* groq */ `
      *[_id == 'global'][0] {
        facebook,
        instagram,
        youtube,
      }`,
    isDraftMode: draftMode().isEnabled,
  });
  return data as QueryProps;
};