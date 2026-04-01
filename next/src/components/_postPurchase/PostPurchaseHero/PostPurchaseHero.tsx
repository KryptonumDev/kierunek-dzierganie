import Markdown from '@/components/ui/markdown';
import Link from 'next/link';
import type { PostPurchaseHeroProps } from './PostPurchaseHero.types';
import NewsletterSection from './_NewsletterSection';
import OfferSection from './_OfferSection';
import styles from './PostPurchaseHero.module.scss';

const PostPurchaseHero = ({ orderId, offer, previewMode = false }: PostPurchaseHeroProps) => {
  return (
    <section className={styles.PostPurchaseHero}>
      <div className={styles.container}>

        {/* ── Left: minimal confirmation ── */}
        <aside className={styles.confirmation}>
          <CheckIcon />
          <p className={styles.confirmationLabel}>
            {previewMode ? 'Podgląd oferty po zakupie' : 'Zamówienie przyjęte'}
          </p>
          <p className={styles.confirmationText}>
            {previewMode
              ? 'Tak będzie wyglądać oferta wyświetlana klientowi zaraz po zakupie tego produktu.'
              : 'Szczegóły oraz dostęp do kursu znajdziesz na swoim koncie. Potwierdzenie wysłaliśmy na podany adres e-mail.'}
          </p>
          {previewMode ? (
            <p className={styles.orderLink}>W podglądzie nie tworzymy prawdziwego zamówienia ani kuponu.</p>
          ) : (
            orderId && (
              <Link
                href={`/moje-konto/zakupy/${orderId}`}
                className={`link ${styles.orderLink}`}
              >
                Szczegóły zamówienia →
              </Link>
            )
          )}
        </aside>

        {/* ── Right: offer ── */}
        <div className={styles.offerSections}>
          {offer.sections.map((section, index) => {
            const isNarrowSection =
              section._type === 'newsletterSignup' ||
              (section._type === 'productOffer' && section.offeredItems.length === 1);
            const isPrimarySection = index === 0;
            const normalizedHeading = section.heading ? normalizeMarkdownStrong(section.heading) : null;
            const normalizedParagraph = section.paragraph ? normalizeMarkdownStrong(section.paragraph) : null;

            return (
              <section
                className={`${styles.offerSection} ${isNarrowSection ? styles.offerSectionNarrow : ''}`}
                key={`${section._type}-${index}`}
              >
              {(normalizedHeading || normalizedParagraph) && (
                <header className={`${styles.sectionHeader} ${isPrimarySection ? styles.sectionHeaderPrimary : ''}`}>
                  {normalizedHeading &&
                    (isPrimarySection ? (
                      <Markdown.h1 className={styles.offerHeadingPrimary}>
                        {normalizedHeading}
                      </Markdown.h1>
                    ) : (
                      <Markdown.h2 className={styles.offerHeading}>{normalizedHeading}</Markdown.h2>
                    ))}
                  {normalizedParagraph && (
                    <Markdown className={styles.offerParagraph}>{normalizedParagraph}</Markdown>
                  )}
                </header>
              )}

              {section._type === 'productOffer' ? (
                <OfferSection
                  offeredItems={section.offeredItems}
                  offerMode={section.offerMode}
                  discountAmount={section.discountAmount}
                  expirationDate={section.expirationDate}
                  couponCode={section.couponCode}
                />
              ) : (
                <NewsletterSection
                  groupId={section.groupId}
                  image={section.image}
                  previewMode={previewMode}
                />
              )}
              </section>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default PostPurchaseHero;

const normalizeMarkdownStrong = (value: string) =>
  value
    .replace(/\*\*\s+/g, '**')
    .replace(/\s+\*\*/g, '**')
    .replace(/__\s+/g, '__')
    .replace(/\s+__/g, '__');

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
