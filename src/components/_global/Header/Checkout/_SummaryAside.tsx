import Img from '@/components/ui/image';
import { courseComplexityEnum } from '@/global/constants';
import { calculateDiscountAmount } from '@/utils/calculate-discount-amount';
import { formatPrice } from '@/utils/price-formatter';
import { useMemo } from 'react';
import styles from './Checkout.module.scss';
import type { AsideProps } from './Checkout.types';

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
      {input.needDelivery && (
        <p>
          <span>Dostawa</span>
          <span>{input.freeDelivery ? formatPrice(0) : formatPrice(input.delivery)}</span>
        </p>
      )}
      {input.discount && (
        <p>
          <span>Kupon: {input.discount.code}</span>
          <span>{formatPrice(calculateDiscountAmount(input.amount, input.discount, input.delivery))}</span>
        </p>
      )}
      {input.virtualMoney && input.virtualMoney > 0 && (
        <p>
          <span>Wykorzystane WZ</span>
          <span>-{formatPrice(input.virtualMoney * 100)}</span>
        </p>
      )}
      <p>
        <span>Razem</span>
        <span>
          {formatPrice(
            input.amount +
              (input.discount ? calculateDiscountAmount(input.amount, input.discount, input.delivery) : 0) -
              (input.virtualMoney ? input.virtualMoney * 100 : 0) +
              (input.needDelivery && !input.freeDelivery ? input.delivery : 0),
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
            {product.type === 'voucher' && (
              <div className={styles['voucher-data']}>
                <p>
                  {product.voucherData?.type === 'PHYSICAL' ? (
                    <>
                      Wersja <strong>fizyczna</strong>
                    </>
                  ) : (
                    <>
                      Wersja <strong>elektroniczna</strong>
                    </>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
