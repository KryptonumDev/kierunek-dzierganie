import { formatPrice } from '@/utils/price-formatter';
import styles from './Checkout.module.scss';
import type { AsideProps } from './Checkout.types';
import { useMemo } from 'react';
import Img from '@/components/ui/image';

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
          <span>0,00 zł</span>
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
        <p key={product.id}>
          <Img
            data={product.image}
            sizes='175px'
          />
          <span>
            {product.quantity}x {product.name}
          </span>
          <span dangerouslySetInnerHTML={{ __html: formatPrice(product.price * product.quantity) }} />
        </p>
      ))}
    </div>
  );
}
