import Markdown from '@/components/ui/markdown';
import styles from './TextSection.module.scss';
import Button from '@/components/ui/Button';
import type { TextSectionTypes } from './TextSection.types';

const TextSection = ({ heading, paragraph, isSubscribed }: TextSectionTypes) => {
  return (
    <section className={styles['TextSection']}>
      <Markdown.h2>{heading}</Markdown.h2>
      <Markdown className={styles.paragraph}>{paragraph}</Markdown>
      {!isSubscribed && (
        <>
          <Button className={styles.cta}>Dołączam do programu</Button>
          <p className={styles.additionalInfo}>Po dołączeniu do programu, dostaniesz swój unikalny kod</p>
        </>
      )}
    </section>
  );
};

export default TextSection;
