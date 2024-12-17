'use client';
import ProductCard from '@/components/ui/ProductCard';
import { getProductBasis } from '@/utils/get-product-basis';
import { setCookie } from '@/utils/set-cookie';
import { useState } from 'react';
import styles from './RelatedMaterials.module.scss';
import type { RelatedMaterialsTypes } from './RelatedMaterials.types';

const RelatedMaterials = ({ data, close, closedMaterials }: RelatedMaterialsTypes) => {
  const [closed, setClosed] = useState(closedMaterials);

  const basis = getProductBasis(data.basis, data._type);

  const closeSection = () => {
    setCookie('relatedMaterials-' + close, 'closed', 1 / 12);
    setClosed(true);
  };

  if (closed) return null;

  return (
    <section className={styles['RelatedMaterials']}>
      {close && (
        <button
          onClick={closeSection}
          className={styles['close']}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
          >
            <path
              d='M17.25 17.25L6.75 6.75M17.25 6.75L6.75 17.25'
              stroke='#9A827A'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </button>
      )}
      <div className={styles['info']}>
        <h2>Potrzebujesz materiałów?</h2>
        <p>
          <strong>Kup pakiet</strong> i miej pod ręką wszystko, czego potrzebujesz do ukończenia kursu
        </p>
      </div>
      <ProductCard
        data={data}
        desktopHorizontal={true}
        basis={basis}
      />
    </section>
  );
};

export default RelatedMaterials;
