import { type ProductCard } from '@/global/types';
import styles from './Popup.module.scss';
import Img from '@/components/ui/image';
import { Hearth } from '@/components/ui/Icons';
import { formatPrice } from '@/utils/price-formatter';
import AddToCart from '@/components/ui/AddToCart';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { productUrls } from '@/global/constants';

export default function Item({
  materials_link,
  printed_manual,
  setShowCart,
  setPopupState,
}: ProductCard & { setShowCart: (variable: boolean) => void; setPopupState: (variable: boolean) => void }) {
  return (
    <>
      {materials_link && (
        <div className={styles.item}>
          <Link
            href={`${productUrls[materials_link.basis]}/${materials_link.slug}`}
            className={styles['link']}
            onClick={() => {
              setPopupState(false);
              setShowCart(false);
            }}
          >
            <Img
              data={materials_link.gallery}
              sizes='(max-width: 713px) 100vw, 293px'
            />
          </Link>
          <div className={styles.content}>
            <div className={styles.textContent}>
              {materials_link.rating !== undefined && materials_link.reviewsCount > 0 ? (
                <p className={styles['rating']}>
                  <Hearth />{' '}
                  <span>
                    <b>{materials_link.rating}</b>/5 ({materials_link.reviewsCount})
                  </span>
                </p>
              ) : (
                <p className={styles['rating']}>
                  <Hearth /> <span>Brak opinii</span>
                </p>
              )}
              <p>{materials_link.name}</p>
              <p>
                <span>{formatPrice(materials_link.price!)}</span>
              </p>
            </div>
            {materials_link.countInStock > 0 ? (
              <AddToCart id={materials_link._id} />
            ) : (
              <Button disabled={true}>Brak na stanie</Button>
            )}
          </div>
        </div>
      )}
      {printed_manual && (
        <div className={styles.item}>
          <Link
            href={`${productUrls[printed_manual.basis]}/${printed_manual.slug}`}
            className={styles['link']}
            onClick={() => {
              setPopupState(false);
              setShowCart(false);
            }}
          >
            <Img
              data={printed_manual.gallery}
              sizes='(max-width: 713px) 100vw, 293px'
            />
          </Link>
          <div className={styles.content}>
            <div className={styles.textContent}>
              {printed_manual.rating !== undefined && printed_manual.reviewsCount > 0 ? (
                <p className={styles['rating']}>
                  <Hearth />{' '}
                  <span>
                    <b>{printed_manual.rating}</b>/5 ({printed_manual.reviewsCount})
                  </span>
                </p>
              ) : (
                <p className={styles['rating']}>
                  <Hearth /> <span>Brak opinii</span>
                </p>
              )}
              <p>{printed_manual.name}</p>
              <p>
                <span>{formatPrice(printed_manual.price!)}</span>
              </p>
            </div>
            {printed_manual.countInStock > 0 ? (
              <AddToCart id={printed_manual._id} />
            ) : (
              <Button disabled={true}>Brak na stanie</Button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
