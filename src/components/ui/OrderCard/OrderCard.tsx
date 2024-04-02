'use client';
import { useMemo } from 'react';
import Img from '../image';
import styles from './OrderCard.module.scss';
import type { OrderCardTypes } from './OrderCard.types';
import { formatDateToPolishLocale } from '@/utils/formatDateToPolishLocale';
import { formatPrice } from '@/utils/price-formatter';
import Link from 'next/link';
import { courseComplexityEnum, statusesSwitch } from '@/global/constants';

const OrderCard = ({ order, product }: OrderCardTypes) => {
  const mainImage = useMemo(
    () => (product.variants?.length > 0 ? product.variants[0]!.gallery : product.gallery),
    [product]
  );

  return (
    <Link
      href={`/moje-konto/zakupy/${order.id}`}
      className={styles['orderCard']}
    >
      <div className={styles['image-wrap']}>
        {product.course && (
          <span
            style={{
              color: courseComplexityEnum[product.course.complexity].color,
              backgroundColor: courseComplexityEnum[product.course.complexity].background,
            }}
            className={styles['badge']}
          >
            {courseComplexityEnum[product.course.complexity].name}
          </span>
        )}
        <Img
          data={mainImage}
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
          <h3>Numer zamówienia: {order.id}</h3>
          <p>{formatDateToPolishLocale(order.created_at)}</p>
        </div>
        <div className={styles['payment']}>
          <p>{formatPrice(order.amount)}</p>
          <span>{order.payment_method}</span>
        </div>
      </div>
    </Link>
  );
};

export default OrderCard;
