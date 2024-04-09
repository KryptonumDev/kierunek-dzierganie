import Img from '@/components/ui/image';
import styles from './ProcessComponent.module.scss';
import type { ProcessComponentTypes } from './ProcessComponent.types';
import Markdown from '@/components/ui/markdown';

const ProcessComponent = ({ list }: ProcessComponentTypes) => {
  return (
    <div className={styles['ProcessComponent']}>
      {list.map(({ img, paragraph }, index) => (
        <div
          key={index}
          className={styles.item}
        >
          {img && (
            <Img
              data={img}
              sizes='(max-width: 499px) 50vw, 33vw'
            />
          )}
          {paragraph && <Markdown className={img ? styles.parargraph : styles.centralized}>{paragraph}</Markdown>}
        </div>
      ))}
    </div>
  );
};

export default ProcessComponent;
