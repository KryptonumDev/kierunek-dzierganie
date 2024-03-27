import { formatPrice } from '@/utils/price-formatter';
import styles from './Checkout.module.scss';
import type { AsideProps } from './Checkout.types';
import { useMemo } from 'react';
import Img from '@/components/ui/image';
import { courseComplexityEnum } from '@/global/constants';

export default function SummaryAside({ input }: AsideProps) {
  const delivery = true;
  const productCount = useMemo(
    () => input.products?.array?.reduce((acc, curr) => acc + curr.quantity, 0) || 0,
    [input.products?.array]
  );
  return (
    <div className={styles['summary-aside']}>
      <h3>Twoje zamówienie</h3>
      <p>
        <span>
          {productCount}
          {productCount === 1 ? ' produkt' : productCount > 1 && productCount < 5 ? ' produkty' : ' produktów'}
        </span>
        <span dangerouslySetInnerHTML={{ __html: formatPrice(input.amount) }} />
      </p>
      {delivery && (
        <p>
          <span>Dostawa</span>
          <span>Za darmo!</span>
        </p>
      )}
      {delivery && (
        <p>
          <span>Razem</span>
          <span dangerouslySetInnerHTML={{ __html: formatPrice(input.amount) }} />
        </p>
      )}
      <h3>Szczegóły zamówienia</h3>
      {input.products?.array?.map((product) => (
        <div
          className={styles['item']}
          key={product.id}
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
