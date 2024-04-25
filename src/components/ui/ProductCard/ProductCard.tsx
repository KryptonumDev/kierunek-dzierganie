'use client';
import { useEffect, useMemo, useState } from 'react';
import styles from './ProductCard.module.scss';
import type { Props } from './ProductCard.types';
import { ImgType } from '@/global/types';
import Img from '../image';
import { formatPrice } from '@/utils/price-formatter';
import Button from '../Button';
import { useCart } from 'react-use-cart';
import { courseComplexityEnum, pageUrls } from '@/global/constants';
import Link from 'next/link';
import { Hearth } from '../Icons';

const ProductCard = ({ data, inCart = false, horizontal, tabletHorizontal, basis }: Props) => {
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
      countInStock?: number | null;
    } = {
      price: '',
      discount: undefined,
      stock: undefined,
      image: undefined,
      type: 'normal',
      name: data.name,
      countInStock: data._type === 'product' ? data.countInStock : 1,
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
    <div
      className={`${styles['productCard']} ${horizontal ? styles['horizontal'] : ''} ${tabletHorizontal ? styles['tablet-horizontal'] : ''}`}
    >
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
          <Img
            data={mainVariant.image}
            sizes='380px'
          />
        </div>
      )}
      <div className={styles['data']}>
        <div>
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
          <p className={styles['price']}>
            <span
              className={mainVariant.discount ? styles['discount'] : ''}
              dangerouslySetInnerHTML={{ __html: mainVariant.price }}
            />
            {mainVariant.discount ? <span dangerouslySetInnerHTML={{ __html: mainVariant.discount }} /> : null}
          </p>
        </div>
        {mainVariant.type === 'variable' ? (
          <Button href={`${basis ? basis : pageUrls[data.basis]}/${data.slug}`}>Wybierz wariant</Button>
        ) : mainVariant.countInStock! > 0 ? (
          <Button
            disabled={buttonText !== 'Dodaj do koszyka'}
            onClick={() => {
              addItem({ quantity: 1, id: data._id, product: data._id, price: 0 }, 1);
              setButtonText('Dodano do koszyka');
            }}
          >
            {buttonText}
          </Button>
        ) : (
          <Button disabled={true}>Brak na stanie</Button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
