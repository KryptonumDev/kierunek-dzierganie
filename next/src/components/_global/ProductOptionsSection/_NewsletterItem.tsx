import Img from '@/components/ui/image';
import Markdown from '@/components/ui/markdown';
import styles from './ProductOptionsSection.module.scss';
import NewsletterItemForm from './_NewsletterItemForm';
import type { ProductOptionsSectionNewsletterItem } from './ProductOptionsSection.types';

const NewsletterItem = ({
  img,
  heading,
  paragraph,
  groupId,
  buttonLabel,
  dedicatedThankYouPage,
}: ProductOptionsSectionNewsletterItem) => {
  return (
    <article className={`${styles.item} ${styles.newsletterItem}`}>
      <Img
        data={img}
        className={styles.image}
        sizes='(max-width: 699px) 100vw, (max-width: 1023px) 50vw, 400px'
      />
      <div className={styles.newsletterContent}>
        <Markdown.h3>{heading}</Markdown.h3>
        {paragraph && <Markdown className={styles.newsletterText}>{paragraph}</Markdown>}
        <NewsletterItemForm
          groupId={groupId}
          buttonLabel={buttonLabel}
          dedicatedThankYouPage={dedicatedThankYouPage}
        />
      </div>
    </article>
  );
};

export default NewsletterItem;
