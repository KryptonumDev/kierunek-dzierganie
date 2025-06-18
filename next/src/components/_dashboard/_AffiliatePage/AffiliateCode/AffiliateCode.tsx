import Markdown from '@/components/ui/markdown';
import styles from './AffiliateCode.module.scss';
import CopyToClipboard from '@/components/ui/CopyToClipboard';
import type { AffiliateCodeTypes } from './AffiliateCode.types';
import Subscribe from '../TextSection/_Subscribe';

const AffiliateCode = ({ heading, paragraph, isSubscribed, code, userId }: AffiliateCodeTypes) => {
  return (
    <section className={styles['AffiliateCode']}>
      <div className={styles['max-width']}>
        <Markdown.h2>{heading}</Markdown.h2>
        <Markdown className={styles.paragraph}>{paragraph}</Markdown>
        {isSubscribed && code ? (
          <div className={styles.code}>
            <p className={styles.paragraph}>Twój kod promocyjny to:</p>
            <div className={styles.box}>
              <p>{code}</p>
              <CopyToClipboard copy={code} />
            </div>
          </div>
        ) : (
          <Subscribe userId={userId}>Świetnie! Generuję kod</Subscribe>
        )}
      </div>
    </section>
  );
};

export default AffiliateCode;
