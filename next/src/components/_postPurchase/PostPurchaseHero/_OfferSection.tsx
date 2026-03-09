'use client';

import Button from '@/components/ui/Button';
import Img from '@/components/ui/image';
import { pageUrls } from '@/global/constants';
import { formatPrice } from '@/utils/price-formatter';
import { useCountdown } from '@/utils/countdown';
import { toast } from 'react-toastify';
import Link from 'next/link';
import type { OfferedItem } from '@/utils/resolve-post-purchase-offer';
import styles from './PostPurchaseHero.module.scss';

type OfferSectionProps = {
  offeredItems: OfferedItem[];
  discountAmount: number;
  expirationDate: string | null;
  couponCode: string;
};

const OfferSection = ({ offeredItems, discountAmount, expirationDate, couponCode }: OfferSectionProps) => {
  const { hours, minutes, seconds } = useCountdown(expirationDate ?? undefined);
  const hasExpired = expirationDate ? new Date(expirationDate).getTime() < Date.now() : false;
  const isExpired = hasExpired || (!!expirationDate && !hours && minutes === '00' && seconds === '00');

  const copyCoupon = () => {
    navigator.clipboard.writeText(couponCode);
    toast('Kod został skopiowany do schowka');
  };

  if (isExpired) {
    return (
      <div className={styles.offerExpired}>
        <p className={styles.expiredLabel}>Oferta wygasła</p>
        <p className={styles.expiredMessage}>Ta wyjątkowa oferta nie jest już dostępna.</p>
      </div>
    );
  }

  const multipleItems = offeredItems.length > 1;

  return (
    <div className={styles.offerActive}>
      {/* Timer — only rendered when an expiration date is configured */}
      {expirationDate && (
        <div
          className={styles.timer}
          aria-live='polite'
        >
          <span className={styles.timerLabel}>Promocja kończy się za</span>
          <span className={styles.timerCountdown}>
            {hours && (
              <>
                <strong>{hours}</strong>
                <span>godz</span>
              </>
            )}
            <strong>{minutes}</strong>
            <span>min</span>
            <strong>{seconds}</strong>
            <span>sek</span>
          </span>
        </div>
      )}

      {/* Product cards — 2-column grid when multiple items */}
      <div className={`${styles.offerItems} ${multipleItems ? styles.offerItemsGrid : ''}`}>
        {offeredItems.map((item) => {
          const basePrice = item.discount ?? item.price;
          const discountedPrice = Math.max(0, basePrice - discountAmount);
          const itemHref = `${pageUrls[item.basis as 'knitting' | 'crocheting']}/${item.slug}`;

          return (
            <div
              key={item._id}
              className={styles.offerItem}
            >
              {/* Invisible cover link makes the whole card clickable */}
              <Link
                href={itemHref}
                className={styles.offerItemCoverLink}
                aria-label={item.name}
                tabIndex={-1}
              />

              {item.image && (
                <div className={styles.offerItemImage}>
                  <Img
                    data={item.image}
                    sizes='(max-width: 900px) 100vw, 400px'
                  />
                </div>
              )}
              <div className={styles.offerItemData}>
                <p className={styles.offerItemName}>{item.name}</p>
                <p className={styles.offerItemPrice}>
                  <span className={styles.originalPrice}>{formatPrice(basePrice)}</span>
                  <span className={styles.discountedPrice}>{formatPrice(discountedPrice)}</span>
                </p>
                <Button
                  href={itemHref}
                  className={styles.offerItemBtn}
                >
                  Kup za {formatPrice(discountedPrice)}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Coupon — clicking anywhere copies the code */}
      <div className={styles.couponBlock}>
        {multipleItems && (
          <p className={styles.couponNotice}>
            Kod działa jednorazowo — wybierz jeden kurs i użyj go przy kasie.
          </p>
        )}
        <button
          className={styles.couponRow}
          onClick={copyCoupon}
          title='Kliknij, aby skopiować kod'
          type='button'
        >
          <span className={styles.couponLabel}>Twój kod rabatowy — kliknij, aby skopiować</span>
          <div className={styles.couponCodeWrapper}>
            <span className={styles.couponCode}>{couponCode}</span>
            {/* Styled as a link visually; the outer button handles the click */}
            <span className={styles.copyBtn}>Skopiuj</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default OfferSection;
