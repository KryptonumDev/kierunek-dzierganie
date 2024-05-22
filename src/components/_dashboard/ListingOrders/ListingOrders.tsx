import OrderCard from '@/components/ui/OrderCard';
import styles from './ListingOrders.module.scss';
import type { ListingOrdersTypes } from './ListingOrders.types';

const ListingOrders = ({ orders, products }: ListingOrdersTypes) => {
  return (
    <section className={styles['ListingOrders']}>
      <h1>
        Historia <strong>zakupów</strong>
      </h1>
      <p>Wszystkie archiwalne zamówienia w Kierunek Dzierganie 😊</p>
      <div className={styles['listing']}>
        {orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            product={products.filter((product) => order.products.array.some((el) => el.id === product._id))[0]!}
          />
        ))}
      </div>
    </section>
  );
};

export default ListingOrders;
