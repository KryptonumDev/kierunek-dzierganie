import Button from '@/components/ui/Button';
import Img from '@/components/ui/image';
import Markdown from '@/components/ui/markdown';
import Link from 'next/link';
import { Arrow1 } from '../TilesIndicated/_Arrow1';
import { Arrow2 } from '../TilesIndicated/_Arrow2';
import styles from './WordsCollection.module.scss';
import type { Props } from './WordsCollection.types';

const WordsCollection = ({ heading, list, cta, index, image }: Props) => {
  const Heading = index === 0 ? Markdown.h1 : Markdown.h2;

  return (
    <section
      className={styles['WordsCollection']}
      data-image={!!image}
    >
      <header>
        <Heading>{heading}</Heading>
        {!!image && (
          <div className={styles.arrows}>
            <Arrow1 className={styles.arrow1} />
            <Arrow2 className={styles.arrow2} />
          </div>
        )}
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
