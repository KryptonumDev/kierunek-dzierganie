import Markdown from '@/components/ui/markdown';
import Button from '@/components/ui/Button';
import styles from './WordsCollection.module.scss';
import type { Props } from './WordsCollection.types';

const WordsCollection = ({ heading, list, cta, index }: Props) => {
  const Heading = index === 0 ? Markdown.h1 : Markdown.h2;

  return (
    <section className={styles['WordsCollection']}>
      <header>
        <Heading>{heading}</Heading>
      </header>
      <ul className={styles.list}>
        {list.map((item, i) => (
          <li key={i} className={styles.item}>
            {item}
          </li>
        ))}
      </ul>
      {cta && (
        <Button
          data={cta}
          className={styles.cta}
        />
      )}
    </section>
  );
};

export default WordsCollection;
