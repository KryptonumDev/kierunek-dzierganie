import Markdown from '@/components/ui/markdown';
import styles from './MaterialsHeading.module.scss';
import type { MaterialsHeadingTypes } from './MaterialsHeading.types';

const MaterialsHeading = ({ heading, paragraph }: MaterialsHeadingTypes) => {
  return (
    <header className={styles['MaterialsHeading']}>
      <Markdown.h2 className={styles.heading}>{heading}</Markdown.h2>
      {paragraph && <Markdown className={styles.paragraph}>{paragraph}</Markdown>}
    </header>
  );
};

export default MaterialsHeading;
