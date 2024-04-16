import Link from 'next/link';
import styles from './OrderData.module.scss';
import type { OrderDataTypes } from './OrderData.types';
import { formatDateToPolishLocale } from '@/utils/formatDateToPolishLocale';
import { formatPrice } from '@/utils/price-formatter';
import { courseComplexityEnum, statusesSwitch } from '@/global/constants';
import Img from '@/components/ui/image';

const OrderData = ({ order, products }: OrderDataTypes) => {
  return (
    <section className={styles['OrderData']}>
      <Link
        className='link'
        href='/moje-konto/zakupy'
      >
        Wróć do historii zamówień
      </Link>
      <h1>
        <strong>Numer</strong> zamówienia: {order.id}
      </h1>
      <div className={styles['grid']}>
        <div className={styles['main']}>
          <p className={styles['title']}>Data:</p>
          <p>{formatDateToPolishLocale(order.created_at)}</p>
        </div>
        <div className={styles['main']}>
          <p className={styles['title']}>Płatność</p>
          <p>
            {formatPrice(order.amount)} <span className={styles['text']}>({order.payment_method})</span>
            {/* <button className='link'>Opłać</button> */}
          </p>
        </div>
        <div>
          <p className={styles['title']}>Dane dostawy</p>
          <p className={styles['text']}>
            {order.shipping.firstName}
            <br />
            {order.shipping.address1}
            <br />
            {order.shipping.city}, {order.shipping.postcode}
            <br />
            {order.shipping.phone}
          </p>
        </div>
        <div>
          <p className={styles['title']}>Dane faktury</p>
          <p className={styles['text']}>
            {order.billing.invoiceType === 'Firma' ? (
              <>
                {order.billing.company}
                <br />
                NIP: {order.billing.nip}
                <br />
              </>
            ) : (
              <>
                {order.billing.firstName}
                <br />
              </>
            )}
            {order.billing.address1}
            <br />
            {order.billing.city}, {order.billing.postcode}
            <br />
            {order.billing.phone}
          </p>
        </div>
      </div>
      <div className={styles['progress']}>
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
      <h2>Zamówione produkty</h2>
      <div className={styles['products']}>
        {products.map((item, i) => (
          <div
            className={styles['product']}
            key={item._id + i}
          >
            <div className={styles['image-wrap']}>
              {item.complexity && (
                <span
                  style={{
                    color: courseComplexityEnum[item.complexity].color,
                    backgroundColor: courseComplexityEnum[item.complexity].background,
                  }}
                  className={styles['badge']}
                >
                  {courseComplexityEnum[item.complexity].name}
                </span>
              )}
              {item.gallery && (
                <Img
                  data={item.gallery}
                  sizes='175px'
                />
              )}
            </div>
            <div className={styles['right-column']}>
              <p>{item.name}</p>
              <div>
                {/* TODO: add attributes */}
                <div></div>
              </div>
              <div className={styles['price']}>
                <span
                  className={item.discount ? styles['discount'] : ''}
                  dangerouslySetInnerHTML={{ __html: formatPrice(item.price!) }}
                />
                {item.discount ? <span dangerouslySetInnerHTML={{ __html: formatPrice(item.discount) }} /> : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OrderData;
