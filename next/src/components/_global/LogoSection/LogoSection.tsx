import Markdown from '@/components/ui/markdown';
import styles from './LogoSection.module.scss';
import type { LogoSectionTypes } from './LogoSection.types';
import Img from '@/components/ui/image';

const LogoSection = ({ heading, logo, paragraph, optional_Paragraph, isHero = false}: LogoSectionTypes) => {
  return (
    <section className={styles['LogoSection']}>
      <header>
        <Img
          data={logo}
          sizes={''}
        />
        {heading && (isHero ? <Markdown.h1>{heading}</Markdown.h1> : <Markdown.h2 className={styles.heading}>{heading}</Markdown.h2>)}
        <Markdown className={styles.paragraph}>{paragraph}</Markdown>
        {optional_Paragraph && <Markdown className={styles.optional_Paragraph}>{optional_Paragraph}</Markdown>}
      </header>
    </section>
  );
};

export default LogoSection;
