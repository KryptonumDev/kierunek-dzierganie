'use client';

import Button from '@/components/ui/Button';
import { Hearth } from '@/components/ui/Icons';
import Img from '@/components/ui/image';
import Link from 'next/link';
import styles from './CourseDiscountCard.module.scss';
import { CourseDiscountCardTypes } from './CourseDiscountCard.types';
import { formatPrice } from '@/utils/price-formatter';

const CourseDiscountCard = ({ data, discountPrice }: CourseDiscountCardTypes) => {
  const { name, slug, image, basis, rating, reviewsCount, price } = data;
  return (
    <div className={styles['courseDiscountCard']}>
      <Link
        href={'/'}
        className={styles['link']}
        aria-label={image?.asset?.altText}
      />
      <Img
        data={image}
        sizes='380px'
      />

      <div className={styles['data']}>
        <div>
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
          <h3 className={styles['names']}>{name}</h3>
          <p className={styles['price']}>
            <span
              className={styles['discount']}
              dangerouslySetInnerHTML={{ __html: formatPrice(price) }}
            />
            <span dangerouslySetInnerHTML={{ __html: formatPrice(discountPrice) }} />
          </p>
        </div>
        <Button>Dodaj do koszyka</Button>
      </div>
    </div>
  );
};

export default CourseDiscountCard;
