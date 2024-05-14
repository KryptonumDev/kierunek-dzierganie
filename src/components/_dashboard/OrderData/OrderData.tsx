'use client';
import Link from 'next/link';
import styles from './OrderData.module.scss';
import type { OrderDataTypes } from './OrderData.types';
import { formatDateToPolishLocale } from '@/utils/formatDateToPolishLocale';
import { formatPrice } from '@/utils/price-formatter';
import { courseComplexityEnum, statusesSwitch } from '@/global/constants';
import Img from '@/components/ui/image';
import { calculateDiscountAmount } from '@/utils/calculate-discount-amount';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import AddReview from '@/components/_global/AddReview';
import { useMemo, useState } from 'react';

const OrderData = ({ order }: OrderDataTypes) => {
  const router = useRouter();
  const [addReview, setAddReview] = useState<string | null>(null);

  const totalItemsCount = useMemo(
    () => order.products.array?.reduce((acc, item) => acc + item.quantity!, 0) ?? 0,
    [order.products.array]
  );
  const totalItemsPrice = useMemo(
    () => order.products.array?.reduce((acc, item) => acc + item.price! * item.quantity!, 0) ?? 0,
    [order.products.array]
  );

  const createIntent = async () => {
    await fetch('/api/payment/recreate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: order.id,
        email: order.billing.email,
        city: order.billing.city,
        address1: order.billing.address1,
        postcode: order.billing.postcode,
        firstName: order.billing.firstName,
        totalAmount: order.amount,
        description: 'Zamówienie w sklepie Kierunek Dzierganie',
      }),
    })
      .then((res) => res.json())
      .then(({ link }) => {
        if (!link) throw new Error('Błąd podczas tworzenia bramki płatności');
        window.location.href = link;
      })
      .catch((err) => {
        toast('Błąd podczas tworzenia bramki płatności');
        console.log(err);
      });
  };

  const removeOrder = async () => {
    await fetch('/api/payment/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: order.id,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) throw new Error('Błąd podczas zmiany statusu zamówienia');
        router.refresh();
      })
      .catch((err) => {
        toast('Błąd podczas zmiany statusu zamówienia');
        console.log(err);
      });
  };

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
          <p className={styles['flex-text']}>
            {formatPrice(order.amount)} <span className={styles['text']}>({order.payment_method})</span>
            {order.orders_statuses.status_name === 'AWAITING PAYMENT' && (
              <button
                onClick={createIntent}
                className='link'
              >
                Opłać
              </button>
            )}
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
            {order.shippingMethod && (
              <>
                <br />
                <br />
                <strong>Metoda dostawy:</strong> {order.shippingMethod.name}
                {order.shippingMethod.data && (
                  <>
                    <br />
                    <span>
                      <strong>Adres:</strong>{' '}
                      {order.shippingMethod.data.street}, {order.shippingMethod.data.postal_code}{' '}
                      {order.shippingMethod.data.city}
                    </span>
                    <br />
                    <span>
                      <strong>Punkt:</strong> {order.shippingMethod.data.foreign_access_point_id}
                    </span>
                    <br />
                    <span>
                      <strong>Dostawca:</strong> {order.shippingMethod.data.supplier}
                    </span>
                  </>
                )}
              </>
            )}
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
        {order.orders_statuses.status_name === 'AWAITING PAYMENT' && (
          <button
            onClick={removeOrder}
            className='link'
          >
            Anuluj zamówienie
          </button>
        )}
      </div>
      <div className={styles['products']}>
        <h2>Zamówione produkty</h2>
        <div className={styles['products-grid']}>
          {order.products.array.map((item, i) => (
            <div
              className={styles['product']}
              key={item.id + i}
            >
              {order.orders_statuses.status_name === 'COMPLETED' && (
                <AddReview
                  open={addReview === item.id}
                  setOpen={setAddReview}
                  user={order.profiles.firstName}
                  product={item}
                />
              )}
              <div className={styles['content']}>
                <div className={styles['image-wrap']}>
                  {item.complexity && (
                    <span
                      style={{
                        color: courseComplexityEnum[item.complexity].color,
                        backgroundColor: courseComplexityEnum[item.complexity].background,
                      }}
                      className={styles['badge']}
                    >
                      <span>{courseComplexityEnum[item.complexity].name}</span>
                    </span>
                  )}
                  {item.image && (
                    <Img
                      data={item.image}
                      sizes='175px'
                    />
                  )}
                </div>
                <div className={styles['right-column']}>
                  <p>{item.name}</p>
                  <div>{item.type === 'product' && <p>Ilość: {item.quantity}</p>}</div>
                  <div className={styles['price']}>
                    <span
                      className={item.discount ? styles['discount'] : ''}
                      dangerouslySetInnerHTML={{ __html: formatPrice(item.price!) }}
                    />
                    {item.discount ? <span dangerouslySetInnerHTML={{ __html: formatPrice(item.discount) }} /> : null}
                  </div>
                </div>
              </div>
              {order.orders_statuses.status_name === 'COMPLETED' && (
                <button
                  onClick={() => setAddReview(item.id)}
                  className='link'
                >
                  Dodaj opinię
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className={styles['summary']}>
        <p>
          <span>
            {totalItemsCount} {totalItemsCount === 1 ? 'produkt' : totalItemsCount < 5 ? 'produkty' : 'produktów'}
          </span>
          <span>{formatPrice(totalItemsPrice)}</span>
        </p>
        {order.discount && (
          <p>
            <span>Kupon: {order.discount.code}</span>
            <span>{formatPrice(calculateDiscountAmount(totalItemsPrice, order.discount))}</span>
          </p>
        )}
        {order.shippingMethod && (
          <p>
            <span>Dostawa</span>
            <span>{formatPrice(order.shippingMethod.price)}</span>
          </p>
        )}
        {order.virtualMoney && order.virtualMoney > 0 && (
          <p>
            <span>Wykorzystane WZ</span>
            <span>-{formatPrice(order.virtualMoney * 100)}</span>
          </p>
        )}
        <p>
          <span>Razem</span>
          <span>
            {formatPrice(
              totalItemsPrice +
                (order.discount ? calculateDiscountAmount(totalItemsPrice, order.discount) : 0) -
                (order.virtualMoney ? order.virtualMoney * 100 : 0) +
                (order.shippingMethod ? order.shippingMethod.price : 0)
            )}
          </span>
        </p>
      </div>
    </section>
  );
};

export default OrderData;
