import Markdown from '@/components/ui/markdown';
import Button from '@/components/ui/Button';
import styles from './TabSection.module.scss';
import Tabs from './_Tabs';
import { Decoration1, Decoration2, Decoration3, Decoration4, Decoration5 } from './_Icons';
import type { Props } from './TabSection.types';

const TabSection = ({ heading, paragraph, list, cta }: Props) => {
  const renderedList = list.map(({ title, description }) => ({
    title,
    description: <Markdown>{description}</Markdown>
  }));

  return (
    <section className={styles['TabSection']}>
      <header>
        <Markdown.h2>{heading}</Markdown.h2>
        {paragraph && <Markdown className={styles.paragraph}>{paragraph}</Markdown>}
      </header>
      <Tabs
        list={renderedList}
        icons={[Decoration1, Decoration2, Decoration3, Decoration4, Decoration5]}
      />
      {cta && (
        <Button
          data={cta}
          className={styles.cta}
        />
      )}
    </section>
  );
};

export default TabSection;