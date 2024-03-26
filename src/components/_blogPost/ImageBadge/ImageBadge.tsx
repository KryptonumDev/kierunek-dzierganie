import styles from './ImageBadge.module.scss';
import type { ImageBadgeTypes } from './ImageBadge.types';

const ImageBadge = ({ badge, img }: ImageBadgeTypes) => {
  console.log(badge, img);
  return <section className={styles['ImageBadge']}></section>;
};

export default ImageBadge;
