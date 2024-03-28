import styles from './ImagesGrid.module.scss';
import type { ImagesGridTypes } from './ImagesGrid.types';

const ImagesGrid = ({ list }: ImagesGridTypes) => {
  console.log(list);
  return <section className={styles['ImagesGrid']}></section>;
};

export default ImagesGrid;
