import AddToCart from '@/components/ui/AddToCart';
import { Hearth } from '@/components/ui/Icons';
import Img from '@/components/ui/image';
import Markdown from '@/components/ui/markdown';
import { formatPrice } from '@/utils/price-formatter';
import Link from 'next/link';
import styles from './RelatedMaterials.module.scss';
import type { RelatedMaterialsTypes } from './RelatedMaterials.types';

const RelatedMaterials = ({ heading, paragraph, materialRef }: RelatedMaterialsTypes) => {
  return (
    <div className={styles['RelatedMaterials']}>
      <header>
        <Markdown.h2>{heading}</Markdown.h2>
        <Markdown>{paragraph}</Markdown>
      </header>
      <div className={styles.container}>
        {materialRef.countInStock !== 0 && (
          <Link
            className={styles.abs}
            href={`/produkty-do-${materialRef.basis === 'knitting' ? 'dziergania' : 'szydelkowania'}/${materialRef.slug}`}
          />
        )}
        <div className={styles.image}>
          <Img
            data={materialRef.image}
            sizes=''
          />
        </div>
        <div className={styles.box}>
          {materialRef.rating !== undefined && materialRef.reviewsCount > 0 ? (
            <p className={styles['rating']}>
              <Hearth />{' '}
              <span>
                <b>{materialRef.rating}</b>/5 ({materialRef.reviewsCount})
              </span>
            </p>
          ) : (
            <p className={styles['rating']}>
              <Hearth /> <span>Brak opinii</span>
            </p>
          )}
          <p className={styles.name}>Pakiet materiałów do kursu</p>
          <p className={styles.price}>{formatPrice(materialRef.price)}</p>
          <AddToCart
            data={{
              price: materialRef.price!,
              discount: materialRef.discount,
              _id: materialRef._id,
              name: materialRef.name,
              _type: materialRef._type,
              basis: materialRef.basis,
            }}
            quantity={materialRef.countInStock}
            id={materialRef._id}
          />
        </div>
      </div>
    </div>
  );
};

export default RelatedMaterials;
