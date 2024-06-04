import { formatPrice } from '@/utils/price-formatter';
import styles from './Checkout.module.scss';
import type { AsideProps } from './Checkout.types';
import { useMemo } from 'react';
import Img from '@/components/ui/image';
import { courseComplexityEnum } from '@/global/constants';
import { calculateDiscountAmount } from '@/utils/calculate-discount-amount';

export default function SummaryAside({ input }: AsideProps) {
  const productCount = useMemo(
    () => input.products?.array?.reduce((acc, curr) => acc + curr.quantity, 0) || 0,
    [input.products?.array]
  );
  return (
    <div className={styles['summary-aside']}>
      <h3>Twoje zamówienie</h3>
      <p>
        <span>
          {productCount} {productCount === 1 ? 'produkt' : productCount < 5 ? 'produkty' : 'produktów'}
        </span>
        <span>{formatPrice(input.amount)}</span>
      </p>
      {input.discount && (
        <p>
          <span>Kupon: {input.discount.code}</span>
          <span>{formatPrice(calculateDiscountAmount(input.amount, input.discount))}</span>
        </p>
      )}
      {input.virtualMoney && input.virtualMoney > 0 && (
        <p>
          <span>Wykorzystane WZ</span>
          <span>-{formatPrice(input.virtualMoney * 100)}</span>
        </p>
      )}
      {input.needDelivery && (
        <p>
          <span>Dostawa</span>
          <span>{formatPrice(input.delivery)}</span>
        </p>
      )}
      <p>
        <span>Razem</span>
        <span>
          {formatPrice(
            input.amount +
              (input.discount ? calculateDiscountAmount(input.amount, input.discount) : 0) -
              (input.virtualMoney ? input.virtualMoney * 100 : 0) +
              (input.needDelivery ? input.delivery : 0),
              0
          )}
        </span>
      </p>
      <h3>Szczegóły zamówienia</h3>
      {input.products?.array?.map((product, i) => (
        <div
          className={styles['item']}
          key={product.id + i}
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
                <span>{courseComplexityEnum[product.complexity].name}</span>
              </span>
            )}
            <Img
              data={product.image}
              sizes='175px'
            />
          </div>
          <div>
            <p className={styles['title']}>{product.name}</p>
            <span
              className={`${styles['price']} ${product.discount ? styles['discount'] : ''}`}
              dangerouslySetInnerHTML={{ __html: formatPrice(product.price * product.quantity) }}
            />
            {product.discount && (
              <span
                className={styles['price']}
                dangerouslySetInnerHTML={{ __html: formatPrice(product.discount * product.quantity) }}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
