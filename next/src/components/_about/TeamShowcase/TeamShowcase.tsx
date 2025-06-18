import Markdown from '@/components/ui/markdown';
import styles from './TeamShowcase.module.scss';
import type { TeamShowcaseTypes } from './TeamShowcase.types';
import Button from '@/components/ui/Button';
import Img from '@/components/ui/image';

const TeamShowcase = ({ heading, paragraph, cta, list }: TeamShowcaseTypes) => {
  return (
    <section className={styles['TeamShowcase']}>
      <header>
        <Markdown.h2>{heading}</Markdown.h2>
        <Markdown>{paragraph}</Markdown>
      </header>
      <div className={styles.items}>
        {list.map(({ isLeftSide, description, img, title }, i) => (
          <div
            className={styles.item}
            key={i}
            data-isleftside={isLeftSide}
          >
            <Img
              data={img}
              sizes='(max-width: 650px) 80vw, (max-width: 1099px) 413px, 58vw'
            />
            <div className={styles.content}>
              <Markdown.h3>{title}</Markdown.h3>
              <Markdown className={styles.description}>{description}</Markdown>
            </div>
          </div>
        ))}
      </div>
      {cta && (
        <Button
          data={cta}
          className={styles.button}
        />
      )}
    </section>
  );
};

export default TeamShowcase;
