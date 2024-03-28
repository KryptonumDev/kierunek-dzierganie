import Markdown from '@/components/ui/markdown';
import Button from '@/components/ui/Button';
import styles from './AffiliateCode.module.scss';
import CopyToClipboard from '@/components/ui/CopyToClipboard';
import type { AffiliateCodeTypes } from './AffiliateCode.types';

const prettifyCode = (code: string) => code.replace(/(\d{3})(\d{3})/, '$1 $2');

const AffiliateCode = ({ heading, paragraph, isSubscribed, code }: AffiliateCodeTypes) => {
  return (
    <section className={styles['AffiliateCode']}>
      <div className={styles['max-width']}>
        <Markdown.h2>{heading}</Markdown.h2>
        <Markdown className={styles.paragraph}>{paragraph}</Markdown>
        {isSubscribed && code ? (
          <div className={styles.code}>
            <p className={styles.paragraph}>Twój kod promocyjny to:</p>
            <div className={styles.box}>
              <p>{prettifyCode(code.toString())}</p>
              <CopyToClipboard copy={prettifyCode(code.toString())} />
            </div>
          </div>
        ) : (
          <>
            <Button
              type='button'
              className={styles.cta}
            >
              Świetnie! Generuję kod
            </Button>
          </>
        )}
      </div>
    </section>
  );
};

export default AffiliateCode;
