'use client';
import { useEffect, useMemo, useState } from 'react';
import styles from './FeaturedProductCard.module.scss';
import type { Props } from './FeaturedProductCard.types';
import { ImgType } from '@/global/types';
import Img from '../image';
import { formatPrice } from '@/utils/price-formatter';
import Button from '../Button';
import { useCart } from 'react-use-cart';
import { courseComplexityEnum, pageUrls } from '@/global/constants';
import Link from 'next/link';
import { Hearth } from '../Icons';

const FeaturedProductCard = ({ excerpt, data, inCart = false, basis, badge }: Props) => {
  const { addItem } = useCart();
  const [buttonText, setButtonText] = useState(inCart ? 'Już w koszyku' : 'Dodaj do koszyka');
  const mainVariant = useMemo(() => {
    const productData: {
      price: string;
      discount?: string;
      stock?: number;
      image?: ImgType;
      type?: 'normal' | 'variable';
      name?: string;
    } = {
      price: '',
      discount: undefined,
      stock: undefined,
      image: undefined,
      type: 'normal',
      name: data.name,
    };

    if (data.variants && data.variants?.length > 0) {
      const minPrice = Math.min(...data.variants.map((variant) => variant.price));
      const maxPrice = Math.max(...data.variants.map((variant) => variant.price));

      const minDiscount = Math.min(...data.variants.map((variant) => variant.discount ?? variant.price));
      const maxDiscount = Math.max(...data.variants.map((variant) => variant.discount ?? variant.price));

      productData['price'] = formatPrice(minPrice) + ' - ' + formatPrice(maxPrice);
      productData['discount'] =
        minPrice !== minDiscount || maxDiscount !== maxPrice
          ? formatPrice(minDiscount) + ' - ' + formatPrice(maxDiscount)
          : undefined;
      productData['stock'] = data.variants[0]!.countInStock;
      productData['image'] = data.variants[0]!.gallery;
      productData['type'] = 'variable';
    } else {
      productData['price'] = formatPrice(data!.price!);
      productData['discount'] = data!.discount ? formatPrice(data!.discount) : undefined;
      productData['stock'] = data!.countInStock;
      productData['image'] = data!.gallery;
    }

    return productData;
  }, [data]);

  useEffect(() => {
    if (buttonText !== 'Dodano do koszyka') setButtonText(inCart ? 'Już w koszyku' : 'Dodaj do koszyka');
  }, [inCart, buttonText]);

  return (
    <div className={`${styles['featuredProductCard']}`}>
      <Link
        href={`${basis ? basis : pageUrls[data.basis]}/${data.slug}`}
        className={styles['link']}
      />
      {mainVariant.image && (
        <div className={styles['image-wrap']}>
          {'complexity' in data && data.complexity && (
            <span
              style={{
                color: courseComplexityEnum[data.complexity].color,
                backgroundColor: courseComplexityEnum[data.complexity].background,
              }}
              className={styles['badge']}
            >
              <span>{courseComplexityEnum[data.complexity].name}</span>
            </span>
          )}
          <div className={styles.imageWrapper}>
            <Img
              data={mainVariant.image}
              sizes='380px'
            />
          </div>
        </div>
      )}
      <div className={styles['bestseller']}>
        <BestSeller />
        <h3>
          <strong>{badge}</strong>
        </h3>
      </div>
      <div className={styles['data']}>
        {data.rating !== undefined && data.reviewsCount > 0 ? (
          <p className={styles['rating']}>
            <Hearth />{' '}
            <span>
              <b>{data.rating}</b>/5 ({data.reviewsCount})
            </span>
          </p>
        ) : (
          <p className={styles['rating']}>
            <Hearth /> <span>Brak opinii</span>
          </p>
        )}
        <h3 className={styles['names']}>{mainVariant.name}</h3>
        {excerpt && <div className={styles['excerpt']}>{excerpt}</div>}
        <div className={styles['flex']}>
          <p className={styles['price']}>
            <span
              className={mainVariant.discount ? styles['discount'] : ''}
              dangerouslySetInnerHTML={{ __html: mainVariant.price }}
            />
            {mainVariant.discount ? <span dangerouslySetInnerHTML={{ __html: mainVariant.discount }} /> : null}
          </p>
          {mainVariant.type === 'variable' ? (
            <Button href={`${basis ? basis : pageUrls[data.basis]}/${data.slug}`}>Wybierz wariant</Button>
          ) : (
            <Button
              disabled={buttonText !== 'Dodaj do koszyka'}
              onClick={() => {
                addItem({ quantity: 1, id: data._id, product: data._id, price: 0 });
                setButtonText('Dodano do koszyka');
              }}
            >
              {buttonText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProductCard;

const BestSeller = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='249'
    height='44'
    viewBox='0 0 249 44'
    fill='none'
  >
    <path
      d='M0 39.2357V4.73572C0 2.52658 1.79086 0.735718 4 0.735718H246.248C248.144 0.735718 248.975 3.12804 247.488 4.30433L226.825 20.6486C225.805 21.4551 225.814 23.005 226.843 23.7999L247.363 39.653C248.872 40.8193 248.048 43.2357 246.14 43.2357H4C1.79086 43.2357 0 41.4449 0 39.2357Z'
      fill='#EFE8E7'
    />
  </svg>
);
