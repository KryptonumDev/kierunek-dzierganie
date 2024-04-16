import Markdown from '@/components/ui/markdown';
import styles from './ImageBadge.module.scss';
import type { ImageBadgeTypes } from './ImageBadge.types';
import Img from '@/components/ui/image';

const ImageBadge = ({ badge, img }: ImageBadgeTypes) => {
  return (
    <div className={styles['ImageBadge']}>
      <Markdown.h2>{badge}</Markdown.h2>
      <Img
        data={img}
        sizes='(max-width: 499px) 100vw, 50vw'
      />
    </div>
  );
};

export default ImageBadge;
