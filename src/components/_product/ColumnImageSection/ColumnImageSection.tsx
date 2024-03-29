import Markdown from '@/components/ui/markdown';
import Img from '@/components/ui/image';
import styles from './ColumnImageSection.module.scss';
import type { ColumnImageSectionTypes } from './ColumnImageSection.types';

const ColumnImageSection = ({ isReversed, heading, suhheading, paragraph, img }: ColumnImageSectionTypes) => {
  const Suhheading = heading ? Markdown.h3 : Markdown.h2;

  return (
    <section
      className={styles['ColumnImageSection']}
      data-reversed={!!isReversed}
    >
      {heading && (
        <header>
          <Markdown.h2>{heading}</Markdown.h2>
        </header>
      )}
      <div className={styles.column}>
        <Img
          data={img}
          sizes=''
        />
        <div>
          {suhheading && <Suhheading className={`h3 ${styles.subheading}`}>{suhheading}</Suhheading>}
          <Markdown>{paragraph}</Markdown>
        </div>
      </div>
    </section>
  );
};

export default ColumnImageSection;
