import Markdown from '@/components/ui/markdown';
import styles from './OrderedList.module.scss';
import type { OrderedListTypes } from './OrderedList.types';

const OrderedList = ({ heading, list, paragraph }: OrderedListTypes) => {
  return (
    <section className={styles['OrderedList']}>
      <header>
        <Markdown.h2>{heading}</Markdown.h2>
      </header>
      <ol className={styles.list}>
        {list.map((item, i) => (
          <li
            className={styles.item}
            key={i}
          >
            {item}
          </li>
        ))}
      </ol>
      {paragraph && <Markdown className={styles.paragraph}>{paragraph}</Markdown>}
    </section>
  );
};

export default OrderedList;
