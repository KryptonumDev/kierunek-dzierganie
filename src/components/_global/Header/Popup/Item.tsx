import { type ItemType } from './item.types';
import Link from 'next/link';
import styles from './Popup.module.scss';
import { productUrls } from '@/global/constants';
import { Hearth } from '@/components/ui/Icons';
import Img from '@/components/ui/image';
import { formatPrice } from '@/utils/price-formatter';
import AddToCart from '@/components/ui/AddToCart';
import Button from '@/components/ui/Button';

export default function Item({
  _id,
  gallery,
  basis,
  slug,
  name,
  rating,
  reviewsCount,
  price,
  countInStock,
  variants,
  setShowCart,
  setPopupState,
}: ItemType) {

  return (
    <div className={styles.item}>
      {variants != null ? (
        <>
          {variants.map((variant, index) => (
            <>
              <Link
                key={index}
                href={`${productUrls[basis]}/${slug}`}
                className={styles['link']}
                onClick={() => {
                  setPopupState(false);
                  setShowCart(false);
                }}
              >
                <Img
                  data={variant.gallery}
                  sizes='(max-width: 713px) 100vw, 293px'
                />
              </Link>
              <div className={styles.content}>
                <div className={styles.textContent}>
                  {rating !== undefined && reviewsCount > 0 ? (
                    <p className={styles['rating']}>
                      <Hearth />{' '}
                      <span>
                        <b>{rating}</b>/5 ({reviewsCount})
                      </span>
                    </p>
                  ) : (
                    <p className={styles['rating']}>
                      <Hearth /> <span>Brak opinii</span>
                    </p>
                  )}
                  <p>{variant.name}</p>
                  <p>
                    <span>{formatPrice(variant.price!)}</span>
                  </p>
                </div>
                {(variant.countInStock ?? 0) > 0 ? (
                  <AddToCart
                    id={_id}
                    variant={variant._id}
                    disabled={variant!.countInStock === 0}
                  />
                ) : (
                  <Button disabled={true}>Brak na stanie</Button>
                )}
              </div>
            </>
          ))}
        </>
      ) : (
        <>
          <Link
            href={`${productUrls[basis]}/${slug}`}
            className={styles['link']}
            onClick={() => {
              setPopupState(false);
              setShowCart(false);
            }}
          >
            <Img
              data={gallery!}
              sizes='(max-width: 713px) 100vw, 293px'
            />
          </Link>
          <div className={styles.content}>
            <div className={styles.textContent}>
              {rating !== undefined && reviewsCount > 0 ? (
                <p className={styles['rating']}>
                  <Hearth />{' '}
                  <span>
                    <b>{rating}</b>/5 ({reviewsCount})
                  </span>
                </p>
              ) : (
                <p className={styles['rating']}>
                  <Hearth /> <span>Brak opinii</span>
                </p>
              )}
              <p>{name}</p>
              <p>
                <span>{formatPrice(price!)}</span>
              </p>
            </div>
            {(countInStock ?? 0) > 0 ? <AddToCart id={_id} /> : <Button disabled={true}>Brak na stanie</Button>}
          </div>
        </>
      )}
    </div>
  );
}
