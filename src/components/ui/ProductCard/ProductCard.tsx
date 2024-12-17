'use client';
import { courseComplexityEnum, pageUrls, productUrls } from '@/global/constants';
import { ImgType } from '@/global/types';
import { formatPrice } from '@/utils/price-formatter';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useCart } from 'react-use-cart';
import Button from '../Button';
import { Hearth } from '../Icons';
import Img from '../image';
import styles from './ProductCard.module.scss';
import type { Props } from './ProductCard.types';

const gtag: Gtag.Gtag = function () {
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer?.push(arguments);
};

const ProductCard = ({
  data,
  inCart = false,
  horizontal,
  tabletHorizontal,
  desktopHorizontal,
  basis,
  onClick,
  owned,
}: Props) => {
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
      _type: string;
    } = {
      price: '',
      discount: undefined,
      stock: undefined,
      image: undefined,
      type: 'normal',
      name: data.name,
      countInStock: data._type === 'product' ? data.countInStock : 1,
      _type: data._type,
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
      className={`${styles['productCard']} ${horizontal ? styles['horizontal'] : ''} ${tabletHorizontal ? styles['tablet-horizontal'] : ''} ${desktopHorizontal ? styles['desktop-horizontal'] : ''}`}
    >
      <Link
        href={`${basis ? basis : data._type === 'product' ? productUrls[data.basis] : pageUrls[data.basis as 'knitting' | 'crocheting']}/${data.slug}`}
        className={styles['link']}
        onClick={onClick}
        aria-label={mainVariant.image?.asset?.altText ? mainVariant.image.asset.altText : `${mainVariant.name}`}
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
          {mainVariant._type !== 'voucher' && (
            <p className={styles['price']}>
              <span
                className={mainVariant.discount ? styles['discount'] : ''}
                dangerouslySetInnerHTML={{ __html: mainVariant.price }}
              />
              {mainVariant.discount ? <span dangerouslySetInnerHTML={{ __html: mainVariant.discount }} /> : null}
            </p>
          )}
        </div>
        {owned ? (
          <Button href={`/moje-konto/kursy/${data.slug}`}>Przejdź do kursu</Button>
        ) : (
          <>
            {mainVariant.type === 'variable' || mainVariant._type === 'voucher' ? (
              <Button
                href={`${basis ? basis : productUrls[data.basis]}/${data.slug}`}
                onClick={onClick}
              >
                Wybierz wariant
              </Button>
            ) : mainVariant.countInStock! > 0 ? (
              <Button
                disabled={buttonText !== 'Dodaj do koszyka'}
                onClick={() => {
                  addItem({ quantity: 1, id: data._id, product: data._id, price: 0 }, 1);
                  if (typeof fbq !== 'undefined') {
                    fbq('track', 'AddToCart', {
                      content_ids: [data._id],
                      content_name: data.name,
                      content_type: 'product',
                      value: data.price! / 100,
                      currency: 'PLN',
                    });
                  }
                  gtag('event', 'add_to_cart', {
                    currency: 'PLN',
                    value: data.discount ? data.discount / 100 : data.price! / 100,
                    items: [
                      {
                        id: data._id,
                        name: data.name,
                        discount: data.discount ? (data.price! - data.discount) / 100 : undefined,
                        price: data.price! / 100,
                        item_category: data._type,
                        item_category2: data.basis,
                        quantity: 1,
                      },
                    ],
                  });
                  setButtonText('Dodano do koszyka');
                  toast('Produkt dodany do koszyka');
                }}
              >
                {buttonText}
              </Button>
            ) : (
              <Button disabled={true}>Brak na stanie</Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
