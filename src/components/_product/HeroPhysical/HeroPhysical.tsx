'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './HeroPhysical.module.scss';
import type { AttributesTypes, Props, SelectedAttributesTypes } from './HeroPhysical.types';
import Select, { SingleValue } from 'react-select';
import { ImgType } from '@/global/types';
import AddToCart from '@/components/ui/AddToCart';
import { formatPrice } from '@/utils/price-formatter';
import Gallery from '@/components/ui/Gallery';
import { Hearth, PayPo } from '@/components/ui/Icons';
import ColorPicker from './ColorPicker';

const gtag: Gtag.Gtag = function () {
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer?.push(arguments);
};

const HeroPhysical = ({ name, id, variants, physical }: Props) => {
  const attributes = useMemo(() => {
    if (!variants) return [];
    const arr = [] as AttributesTypes;

    // get all unique attributes from all variants
    variants.forEach((v) => {
      v.attributes!.forEach((a) => {
        const index = arr.findIndex((x) => x.name === a.name.toLocaleLowerCase());

        if (index === -1) {
          arr.push({
            type: a.type,
            name: a.name.toLocaleLowerCase(),
            value: [a.value],
          });
        } else if (!arr[index]!.value.includes(a.value)) {
          if (arr[index]!.value) {
            arr[index]!.value.push(a.value);
          }
        }
      });
    });

    return arr;
  }, [variants]);

  const [count, setCount] = useState(variants ? 1 : physical.countInStock > 0 ? 1 : 0);
  const [chosenVariant, setChosenVariant] = useState(variants ? variants[0] : physical);
  const [chosenAttributes, setChosenAttributes] = useState(() => {
    const obj = {} as SelectedAttributesTypes;
    attributes.forEach((el) => {
      obj[el.name] = el.value[0];
    });
    return obj;
  });

  const images = useMemo(() => {
    const images: Array<{ data: ImgType | string; type: 'video' | 'image' }> = [];
    // add video as first element if exists
    if (chosenVariant?.featuredVideo) images.push({ type: 'video', data: chosenVariant?.featuredVideo });
    chosenVariant?.gallery!.forEach((el) => images.push({ type: 'image', data: el }));
    return images;
  }, [chosenVariant]);

  const selectVariant = useCallback(
    (v: SingleValue<{ value: string | undefined; label: string | undefined }>, name: string) => {
      const filteredAttributes = { ...chosenAttributes };
      filteredAttributes[name] = v?.value;

      // find variant with all the same attributes
      const filteredVariant = variants.find((el) => {
        let all = true;
        el.attributes!.every((attr) => {
          if (filteredAttributes[attr.name.toLocaleLowerCase()] !== attr.value) all = false;

          return all;
        });
        return all;
      });

      setChosenVariant(filteredVariant);
      setChosenAttributes(filteredAttributes);
      setCount(filteredVariant!.countInStock > 0 ? 1 : 0);
    },
    [variants, chosenAttributes]
  );

  useEffect(() => {
    if (chosenVariant) {
      const product_id = chosenVariant._id;
      const product_name = chosenVariant.name;
      const product_price = chosenVariant.price / 100;
      if (typeof fbq !== 'undefined') {
        fbq('track', 'ViewContent', {
          content_ids: [product_id],
          content_name: product_name,
          contents: [{
            id: product_id,
            item_price: product_price,
            quantity: 1,
          }],
          content_type: 'product',
          value: product_price,
          currency: 'PLN',
        });
      }
      gtag('event', 'view_item', {
        currency: 'PLN',
        value: chosenVariant.discount ? chosenVariant.discount / 100 : chosenVariant.price / 100,
        items: [
          {
            id: product_id,
            name: product_name,
            discount: chosenVariant.discount ? (chosenVariant.price - chosenVariant.discount) / 100 : null,
            price: product_price,
            item_variant: attributes.length > 0 ? chosenVariant._id : null,
            item_category: 'product',
            item_category2: physical.basis,
          },
        ],
      });
    }
  }, [attributes.length, chosenVariant, id, physical.basis]);

  return (
    <section className={styles['HeroPhysical']}>
      <Gallery images={images} />
      <div className={styles['info']}>
        {physical.rating !== undefined && physical.reviewsCount > 0 ? (
          <p className={styles['rating']}>
            <Hearth />{' '}
            <span>
              <b>{physical.rating}</b>/5 ({physical.reviewsCount})
            </span>
          </p>
        ) : (
          <p className={styles['rating']}>
            <Hearth /> <span>Brak opinii</span>
          </p>
        )}
        <h1>{name}</h1>
        <div className={styles.attributes}>
          {attributes.map((el, i) => (
            <>
              {el.type === 'color' ? (
                <div
                  key={i}
                  className={styles.colorPicker}
                >
                  <span>Wybierz {el.name}</span>
                  {el.value.map((hex, index) => (
                    <ColorPicker
                      key={index}
                      hex={hex}
                      onClick={() => selectVariant({ value: hex, label: hex }, el.name)}
                      data-selected={chosenAttributes[el.name] == hex}
                    />
                  ))}
                </div>
              ) : (
                <p key={i}>
                  <span>Wybierz {el.name}</span>
                  <Select
                    className='select'
                    classNamePrefix='select'
                    defaultValue={{ value: chosenAttributes[el.name], label: chosenAttributes[el.name] }}
                    onChange={(e) => selectVariant(e, el.name)}
                    options={(() => [...el.value.map((v) => ({ value: v, label: v }))])()}
                  />
                </p>
              )}
            </>
          ))}
        </div>
        <div className={styles['flex']}>
          <div className={styles['calculator']}>
            <div>
              <button
                disabled={count <= 1}
                onClick={() => {
                  setCount(count - 1);
                }}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='13'
                  height='2'
                  fill='none'
                >
                  <path
                    stroke='#9A827A'
                    d='M12.3.7H1'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </button>
              <input
                type='number'
                max={chosenVariant!.countInStock}
                min={1}
                value={count}
                onChange={(e) => {
                  // check if input is not higher than countInStock and not lower than 1
                  if (Number(e.target.value) <= 1) setCount(1);
                  else if (Number(e.target.value) >= chosenVariant!.countInStock!)
                    setCount(chosenVariant!.countInStock!);
                  else setCount(Number(e.target.value));
                }}
              />
              <button
                disabled={count >= chosenVariant!.countInStock!}
                onClick={() => {
                  setCount(count + 1);
                }}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='13'
                  height='13'
                  fill='none'
                >
                  <path
                    stroke='#9A827A'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M6.9 1.2v11m5.6-5.5H1.2'
                  />
                </svg>
              </button>
            </div>
            <p>Dostępne: {chosenVariant!.countInStock}&nbsp;sztuk</p>
          </div>
          <div className={styles['price']}>
            <p>
              <span className={chosenVariant!.discount ? styles['discount'] : ''}>
                {formatPrice(chosenVariant!.price!)}
              </span>{' '}
              {chosenVariant!.discount && <span>{chosenVariant!.discount / 100}&nbsp;zł</span>}
            </p>
            <small>Najniższa cena z 30 dni przed obniżką: {formatPrice(chosenVariant!.price)}</small>
          </div>
        </div>
        <div className={styles['add-to-cart']}>
          <p className={styles['pay-po']}>
            Kup dzisiaj i zapłać za 30 dni z PayPo
            <PayPo />
          </p>
          <AddToCart
            id={id}
            variant={variants ? chosenVariant?._id : undefined}
            disabled={!count || chosenVariant!.countInStock === 0}
            quantity={count}
            data={{
              price: chosenVariant!.price,
              discount: chosenVariant!.discount,
              _id: id,
              name: chosenVariant!.name,
              _type: 'product',
              variant: variants ? chosenVariant!._id : undefined,
              basis: physical.basis,
            }}
          />
        </div>
        <div className={styles['divider']} />
        <div className={styles['annotations']}>
          {/* TODO: Rework to fetch from sanity */}
          <p>Dostawa w&nbsp;ciągu 3&nbsp;dni</p>
          <p>Darmowy zwrot do 14&nbsp;dni</p>
        </div>
      </div>
    </section>
  );
};

export default HeroPhysical;
