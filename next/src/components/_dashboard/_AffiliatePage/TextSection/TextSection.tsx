import Markdown from '@/components/ui/markdown';
import styles from './TextSection.module.scss';
import type { TextSectionTypes } from './TextSection.types';
import Subscribe from './_Subscribe';

const TextSection = ({ heading, paragraph, isSubscribed, userId }: TextSectionTypes) => {
  return (
    <section className={styles['TextSection']}>
      <Markdown.h2>{heading}</Markdown.h2>
      <Markdown className={styles.paragraph}>{paragraph}</Markdown>
      {!isSubscribed && (
        <>
          <Subscribe userId={userId}>Dołączam do programu</Subscribe>
          <p className={styles.additionalInfo}>Po dołączeniu do programu, dostaniesz swój unikalny kod</p>
        </>
      )}
    </section>
  );
};

export default TextSection;
