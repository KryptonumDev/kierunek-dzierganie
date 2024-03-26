import Img from '@/components/ui/image';
import styles from './ProcessShowcase.module.scss';
import type { ProcessShowcaseTypes } from './ProcessShowcase.types';
import Markdown from '@/components/ui/markdown';

const ProcessShowcase = ({ list }: ProcessShowcaseTypes) => {
  return (
    <div className={styles['ProcessShowcase']}>
      {list.map(({ heading, process }, index) => (
        <div
          key={index}
          className={styles.item}
        >
          <Markdown.h2 className={styles.heading}>{heading}</Markdown.h2>
          <div className={styles.process}>
            {process.map(({ img, paragraph }, index) => (
              <div
                key={index}
                className={styles.processItem}
              >
                <Img
                  data={img}
                  sizes=''
                />
                <Markdown>{paragraph}</Markdown>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProcessShowcase;
