'use client';
import { useCallback, useMemo, useState } from 'react';
import styles from './HeroPhysical.module.scss';
import type { AttributesTypes, Props, SelectedAttributesTypes } from './HeroPhysical.types';
import Select, { SingleValue } from 'react-select';
import Img from '@/components/ui/image';
import { ImgType } from '@/global/types';
import AddToCart from '@/components/ui/AddToCart';

const gallerySwitch = (data: ImgType | string) => ({
  image: (
    <Img
      data={data as ImgType}
      sizes=''
    />
  ),
  video: (
    <iframe
      src={data as string}
      style={{ aspectRatio: '16/9', width: '100%', height: 'auto' }}
    />
  ),
});

const HeroPhysical = ({ name, id, type, variants, physical }: Props) => {
  const attributes = useMemo(() => {
    if(!variants) return [];
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

  const [count, setCount] = useState(1);
  const [chosenVariant, setChosenVariant] = useState(variants ? variants[0] : physical);
  const [selectedImage, setSelectedImage] = useState(0);
  const [chosenAttributes, setChosenAttributes] = useState(() => {
    const obj = {} as SelectedAttributesTypes;
    attributes.forEach((el) => {
      obj[el.name] = el.value[0];
    });
    return obj;
  });

  const images = useMemo(() => {
    const images = [];
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
      setSelectedImage(0);
      setCount(filteredVariant!.countInStock > 0 ? 1 : 0);
    },
    [variants, chosenAttributes]
  );

  return (
    <section className={styles['HeroPhysical']}>
      <div className={styles['gallery']}>
        {gallerySwitch(images[selectedImage]!.data)[images[selectedImage]!.type as 'image' | 'video']}
        <div className={styles['gallery-grid']}>
          {images.map((el, index) => {
            if (index === selectedImage) return null;
            return (
              <button
                onClick={() => setSelectedImage(index)}
                key={index}
              >
                {gallerySwitch(el.data)[el.type as 'image' | 'video']}
              </button>
            );
          })}
        </div>
      </div>
      <div className={styles['info']}>
        {/* <p>reviews</p> TODO: add reviews */}
        <h1>{name}</h1>
        <div className={styles.attributes}>
          {attributes.map((el) => (
            <p key={el.name}>
              <span>Wybierz {el.name}</span>
              <Select
                defaultValue={{ value: chosenAttributes[el.name], label: chosenAttributes[el.name] }}
                onChange={(e) => selectVariant(e, el.name)}
                options={(() => [...el.value.map((v) => ({ value: v, label: v }))])()}
              />
            </p>
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
                -
              </button>
              <input
                type='number'
                max={chosenVariant!.countInStock}
                min={1}
                value={count}
                onChange={(e) => {
                  // check if input is not higher than countInStock and not lower than 1
                  if (Number(e.target.value) <= 1) setCount(1);
                  else if (Number(e.target.value) >= chosenVariant!.countInStock!) setCount(chosenVariant!.countInStock!);
                  else setCount(Number(e.target.value));
                }}
              />
              <button
                disabled={count >= chosenVariant!.countInStock!}
                onClick={() => {
                  setCount(count + 1);
                }}
              >
                +
              </button>
            </div>
            <p>Dostępne: {chosenVariant!.countInStock}&nbsp;sztuk</p>
          </div>
          <div className={styles['price']}>
            <p>
              <span className={chosenVariant!.discount ? styles['discount'] : ''}>
                {(chosenVariant!.price! / 100).toFixed(2).replace('.', ',')}&nbsp;zł
              </span>{' '}
              {chosenVariant!.discount && <span>{chosenVariant!.discount / 100}&nbsp;zł</span>}
            </p>
            <small>Najniższa cena z 30 dni przed obniżką: TODO zł</small>
          </div>
        </div>
        <AddToCart
          id={id}
          type={type}
          variant={chosenVariant}
          disabled={!count}
        />
        <div className={styles['divider']} />
        <div className={styles['annotations']}>
          <p>Darmowa dostawa od 199&nbsp;zł</p>
          <p>Dostawa w&nbsp;ciągu 3&nbsp;dni</p>
          <p>Darmowy zwrot do 14&nbsp;dni</p>
        </div>
      </div>
    </section>
  );
};

export default HeroPhysical;
