'use client';
import ProductCard from '@/components/ui/ProductCard';
import styles from './RelatedMaterials.module.scss';
import type { RelatedMaterialsTypes } from './RelatedMaterials.types';
import { setCookie } from '@/utils/set-cookie';
import { useMemo, useState } from 'react';

const RelatedMaterials = ({ data, close, closedMaterials }: RelatedMaterialsTypes) => {
  const [closed, setClosed] = useState(closedMaterials);
  const basis = useMemo(() => {
    if (data.basis === 'crocheting') {
      if (data._type === 'product') return '/produkty-do-szydelkowania';
      else return '/kursy-szydelkowania';
    } else if (data.basis === 'knitting') {
      if (data._type === 'product') return '/produkty-do-dziergania';
      else return '/kursy-dziergania-na-drutach';
    }
  }, [data]);

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
