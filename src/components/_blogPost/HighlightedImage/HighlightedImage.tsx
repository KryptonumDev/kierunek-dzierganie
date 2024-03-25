import styles from './HighlightedImage.module.scss';
import type { HighlightedImageTypes } from './HighlightedImage.types';

const HighlightedImage = ({ img, isBackground, paragraph }: HighlightedImageTypes) => {
  console.log(img, isBackground, paragraph);
  return <section className={styles['HighlightedImage']}></section>;
};

export default HighlightedImage;
