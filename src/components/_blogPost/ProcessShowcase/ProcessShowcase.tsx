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
            {process.map(({ img, paragraph, isReversed }, index) => (
              <div
                key={index}
                className={styles.processItem}
                data-reversed={isReversed}
              >
                {img && (
                  <Img
                    data={img}
                    sizes='(max-width: 499px) 50vw, 33vw'
                  />
                )}
                <Markdown data-fullWidth={img == undefined}>{paragraph}</Markdown>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProcessShowcase;
