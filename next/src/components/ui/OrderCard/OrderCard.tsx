'use client';
import { courseComplexityEnum, statusesSwitch } from '@/global/constants';
import { formatDateToPolishLocale } from '@/utils/formatDateToPolishLocale';
import { formatPrice } from '@/utils/price-formatter';
import Link from 'next/link';
import { useMemo } from 'react';
import Img from '../image';
import styles from './OrderCard.module.scss';
import type { OrderCardTypes } from './OrderCard.types';

const OrderCard = ({ order, product }: OrderCardTypes) => {
  const mainImage = useMemo(
    () => (product ? (product?.variants ? product?.variants[0]!.gallery : product.gallery!) : null),
    [product]
  );
  if (!product) return null;
  return (
    <Link
      href={`/moje-konto/zakupy/${order.id}`}
      className={styles['orderCard']}
    >
      <div className={styles['image-wrap']}>
        {product.complexity && (
          <span
            style={{
              color: courseComplexityEnum[product.complexity].color,
              backgroundColor: courseComplexityEnum[product.complexity].background,
            }}
            className={styles['badge']}
          >
            {courseComplexityEnum[product.complexity].name}
          </span>
        )}
        <Img
          data={mainImage!}
          sizes='320px'
        />
      </div>
      <div className={styles['information']}>
        <div className={styles['status']}>
          <p>Status: {statusesSwitch[order.orders_statuses.status_name]}</p>
          <span
            style={
              {
                '--percent': `${order.orders_statuses.complete_percent}%`,
              } as React.CSSProperties
            }
            className={styles['line']}
          />
        </div>
        <div className={styles['main-data']}>
          <h2>Numer zamówienia: {order.id}</h2>
          <p>{formatDateToPolishLocale(order.created_at)}</p>
        </div>
        <div className={styles['payment']}>
          <p>{formatPrice(order.amount, 0)}</p>
          <span>{order.payment_method}</span>
        </div>
      </div>
    </Link>
  );
};

export default OrderCard;
