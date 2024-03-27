import Img from '@/components/ui/image';
import styles from './HighlightedImage.module.scss';
import type { HighlightedImageTypes } from './HighlightedImage.types';
import Markdown from '@/components/ui/markdown';

const HighlightedImage = ({ img, isBackground, paragraph }: HighlightedImageTypes) => {
  return (
    <div
      className={styles['HighlightedImage']}
      data-background={isBackground}
    >
      <Img
        data={img}
        sizes=''
      />
      <Markdown>{paragraph}</Markdown>
    </div>
  );
};

export default HighlightedImage;
