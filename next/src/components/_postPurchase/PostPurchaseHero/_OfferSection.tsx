'use client';

import Button from '@/components/ui/Button';
import Img from '@/components/ui/image';
import { pageUrls, productUrls } from '@/global/constants';
import { formatPrice } from '@/utils/price-formatter';
import { useCountdown } from '@/utils/countdown';
import { toast } from 'react-toastify';
import Link from 'next/link';
import type { OfferedItem } from '@/utils/resolve-post-purchase-offer';
import styles from './PostPurchaseHero.module.scss';

type OfferSectionProps = {
  offeredItems: OfferedItem[];
  offerMode: 'discounted' | 'standard';
  discountAmount: number | null;
  expirationDate: string | null;
  couponCode: string | null;
};

const getOfferItemHref = (item: OfferedItem) => {
  if (item._type === 'product' && item.basis in productUrls) {
    return `${productUrls[item.basis as keyof typeof productUrls]}/${item.slug}`;
  }

  if (item.basis in pageUrls) {
    return `${pageUrls[item.basis as keyof typeof pageUrls]}/${item.slug}`;
  }

  return `/${item.slug}`;
};

const getOfferItemEffectivePrices = (item: OfferedItem): number[] => {
  const variantPrices =
    item.variants
      ?.map((variant) => (typeof variant.discount === 'number' ? variant.discount : variant.price))
      .filter((price): price is number => typeof price === 'number' && price >= 0) ?? [];

  if (variantPrices.length) {
    return variantPrices;
  }

  const singlePrice = typeof item.discount === 'number' ? item.discount : item.price;
  return typeof singlePrice === 'number' && singlePrice >= 0 ? [singlePrice] : [];
};

const formatOfferPriceRange = (prices: number[]): string | null => {
  if (!prices.length) return null;

  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  return minPrice === maxPrice ? formatPrice(minPrice) : `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
};

const getOfferItemImage = (item: OfferedItem) => {
  if (item.image) return item.image;
  return item.variants?.find((variant) => variant.image)?.image ?? null;
};

const OfferSection = ({ offeredItems, offerMode, discountAmount, expirationDate, couponCode }: OfferSectionProps) => {
  const { hours, minutes, seconds } = useCountdown(expirationDate ?? undefined);
  const hasExpired = expirationDate ? new Date(expirationDate).getTime() < Date.now() : false;
  const isExpired = hasExpired || (!!expirationDate && !hours && minutes === '00' && seconds === '00');
  const hasDiscount = offerMode === 'discounted' && typeof discountAmount === 'number' && discountAmount > 0;

  const copyCoupon = () => {
    if (!couponCode) return;
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
      {/* Timer — rendered only for discounted offers with an expiry */}
      {hasDiscount && expirationDate && (
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
      <div
        className={`${styles.offerItems} ${multipleItems ? styles.offerItemsGrid : styles.offerItemsSingle}`}
      >
        {offeredItems.map((item) => {
          const effectivePrices = getOfferItemEffectivePrices(item);
          const discountedPrices =
            hasDiscount && typeof discountAmount === 'number'
              ? effectivePrices.map((price) => Math.max(0, price - discountAmount))
              : effectivePrices;
          const basePriceLabel = formatOfferPriceRange(effectivePrices);
          const discountedPriceLabel = formatOfferPriceRange(discountedPrices);
          const itemHref = getOfferItemHref(item);
          const itemImage = getOfferItemImage(item);

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

              {itemImage && (
                <div className={styles.offerItemImage}>
                  <Img
                    data={itemImage}
                    sizes='(max-width: 900px) 100vw, 400px'
                  />
                </div>
              )}
              <div className={styles.offerItemData}>
                <p className={styles.offerItemName}>{item.name}</p>
                {discountedPriceLabel && (
                  <p className={styles.offerItemPrice}>
                    {hasDiscount && basePriceLabel && <span className={styles.originalPrice}>{basePriceLabel}</span>}
                    <span className={styles.discountedPrice}>{discountedPriceLabel}</span>
                  </p>
                )}
                <Button
                  href={itemHref}
                  className={styles.offerItemBtn}
                >
                  {hasDiscount && discountedPriceLabel ? `Kup za ${discountedPriceLabel}` : 'Zobacz szczegóły'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Coupon — clicking anywhere copies the code */}
      {hasDiscount && couponCode && (
        <div className={styles.couponBlock}>
          {multipleItems && (
            <p className={styles.couponNotice}>
              Kod działa jednorazowo — wybierz jeden produkt i użyj go przy kasie.
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
      )}
    </div>
  );
};

export default OfferSection;
