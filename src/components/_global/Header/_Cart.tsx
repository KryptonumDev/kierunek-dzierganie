'use client';
import { useCartItems } from '@/utils/useCartItems';
import styles from './Header.module.scss';
import { Cart } from './Header.types';
import Img from '@/components/ui/image';
import Button from '@/components/ui/Button';
import ProductCard from '@/components/ui/ProductCard';

export default function Cart({ image_crochet, image_knitting, highlighted_products }: Cart) {
  const { sum, cart, fetchedItems, updateItemQuantity, updateItem, removeItem, loading } = useCartItems();
  debugger

  return (
    <div className={styles['cart']}>
      <div className={styles['flex']}>
        <h3>Twoje produkty</h3>
        <button>
          <svg
            width='24'
            height='25'
            viewBox='0 0 24 25'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M17.25 17.5171L6.75 7.01709M17.25 7.01709L6.75 17.5171'
              stroke='#9A827A'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </button>
      </div>
      <EmptyLayout
        image_crochet={image_crochet}
        image_knitting={image_knitting}
      />

      {highlighted_products && (
        <div>
          <h3>
            Te produkty mogą Ci się <strong>spodobać</strong>
          </h3>
          <div className={styles['grid']}>
            {highlighted_products.map((product, i) => (
              <ProductCard
                data={product}
                key={i}
                inCart={cart?.some((item) => item.id === product._id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const EmptyLayout = ({ image_crochet, image_knitting }: Cart) => {
  return (
    <div className={styles['empty']}>
      <h2 className='h1'>
        Twój koszyk jest <strong>pusty</strong>
      </h2>
      <p>Zapraszamy do zakupów 😉</p>
      <div className={styles['grid']}>
        <div>
          <Img
            data={image_knitting}
            sizes='(max-width: 640px) 150px, 300px'
          />
          <Button href='/dzierganie-na-drutach'>Dzierganie na drutach</Button>
        </div>
        <div>
          <Img
            data={image_crochet}
            sizes='(max-width: 640px) 150px, 300px'
          />
          <Button href='/szydelkowanie'>Szydełkowanie</Button>
        </div>
      </div>
    </div>
  );
};
