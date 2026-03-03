import Markdown from '@/components/ui/markdown';
import Link from 'next/link';
import type { PostPurchaseHeroProps } from './PostPurchaseHero.types';
import OfferSection from './_OfferSection';
import styles from './PostPurchaseHero.module.scss';

const PostPurchaseHero = ({ orderId, offer }: PostPurchaseHeroProps) => {
  return (
    <section className={styles.PostPurchaseHero}>
      <div className={`${styles.container} ${offer.offeredItems.length === 1 ? styles.containerSingle : ''}`}>

        {/* ── Left: minimal confirmation ── */}
        <aside className={styles.confirmation}>
          <CheckIcon />
          <p className={styles.confirmationLabel}>Zamówienie przyjęte</p>
          <p className={styles.confirmationText}>
            Szczegóły oraz dostęp do kursu znajdziesz na swoim koncie. Potwierdzenie
            wysłaliśmy na podany adres&nbsp;e-mail.
          </p>
          <Link
            href={`/moje-konto/zakupy/${orderId}`}
            className={`link ${styles.orderLink}`}
          >
            Szczegóły zamówienia →
          </Link>
        </aside>

        {/* ── Right: offer ── */}
        <div className={styles.offer}>
          <Markdown.h2 className={styles.offerHeading}>{offer.heading}</Markdown.h2>
          {offer.paragraph && (
            <Markdown className={styles.offerParagraph}>{offer.paragraph}</Markdown>
          )}
          <OfferSection
            offeredItems={offer.offeredItems}
            discountAmount={offer.discountAmount}
            expirationDate={offer.expirationDate}
            couponCode={offer.couponCode}
          />
        </div>

      </div>
    </section>
  );
};

export default PostPurchaseHero;

const CheckIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={36}
    height={36}
    fill='none'
    aria-hidden='true'
    className={styles.checkIcon}
  >
    <circle
      cx={18}
      cy={18}
      r={17.5}
      stroke='currentColor'
    />
    <path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.5}
      d='M11 18.5l5 5 9-10'
    />
  </svg>
);
