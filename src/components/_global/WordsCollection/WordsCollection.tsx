import Button from '@/components/ui/Button';
import Img from '@/components/ui/image';
import Markdown from '@/components/ui/markdown';
import Link from 'next/link';
import styles from './WordsCollection.module.scss';
import type { Props } from './WordsCollection.types';

const WordsCollection = ({ heading, list, cta, index, image }: Props) => {
  const Heading = index === 0 ? Markdown.h1 : Markdown.h2;

  console.log(image);

  return (
    <section
      className={styles['WordsCollection']}
      data-image={!!image}
    >
      <header>
        <Heading>{heading}</Heading>
      </header>
      <div className={styles.container}>
        <ul className={styles.list}>
          {list.map((item, i) => (
            <li
              key={i}
              className={styles.item}
            >
              {item.href ? <Link href={item.href}>{item.name}</Link> : <span>{item.name}</span>}
            </li>
          ))}
        </ul>{' '}
        {image && (
          <Img
            data={image}
            sizes=''
          />
        )}
      </div>
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
