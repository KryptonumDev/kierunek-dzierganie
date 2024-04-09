import Img from '@/components/ui/image';
import styles from './ImagesGrid.module.scss';
import type { ImagesGridTypes } from './ImagesGrid.types';
import Markdown from '@/components/ui/markdown';

const ImagesGrid = ({ list }: ImagesGridTypes) => {
  return (
    <div className={styles['ImagesGrid']}>
      {list.map(({ img, paragraph }, index) => (
        <div
          key={index}
          className={styles.item}
        >
          <Img
            data={img}
            sizes=''
          />
          {paragraph && <Markdown>{paragraph}</Markdown>}
        </div>
      ))}
    </div>
  );
};

export default ImagesGrid;
