import Markdown from '@/components/ui/markdown';
import Button from '@/components/ui/Button';
import styles from './WordsCollection.module.scss';
import type { Props } from './WordsCollection.types';
import List from './_List';

const WordsCollection = ({ heading, list, cta, index }: Props) => {
  const HeadingComponenet = index === 0 ? Markdown.h1 : Markdown.h2;
  const renderedList = list.map((item) => ({
    text: item,
    marginLeft: `${Math.floor(Math.random() * 39)}%`,
    y: Math.random() * -96,
  }));

  return (
    <section className={styles['WordsCollection']}>
      <header>
        <HeadingComponenet>{heading}</HeadingComponenet>
      </header>
      <List list={renderedList} />
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
