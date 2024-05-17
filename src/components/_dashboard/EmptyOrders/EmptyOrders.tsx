import Button from '@/components/ui/Button';
import styles from './EmptyOrders.module.scss';
import type { Props } from './EmptyOrders.types';
import Img from '@/components/ui/image';
import Link from 'next/link';
import { CrochetingLogo, KnittingLogo } from '@/components/ui/Icons';

const EmptyOrders = ({ image_crochet, image_knitting }: Props) => {
  return (
    <section className={styles['EmptyOrders']}>
      <h1>
        Historia <strong>zakupów</strong>
      </h1>
      <h2 className='h1'>
        Jeszcze nie masz żadnych <strong>zakupionych produktów</strong>
      </h2>
      <p>
        Jeśli chcesz nauczyć się od podstaw <strong>dziergać lub szydełkować</strong>, kliknij któryś z kafelków niżej
      </p>
      <div className={styles['grid']}>
        <div>
          <Link
            href='/kursy-dziergania-na-drutach'
            className={styles.img}
          >
            <div className={styles.iconWrapper}>
              <KnittingLogo />
            </div>
            <Img
              data={image_knitting}
              sizes='(max-width: 640px) 150px, 300px'
              className={styles.image}
            />
          </Link>
          <Button
            href='/kursy-dziergania-na-drutach'
            className={styles.cta}
          >
            Kursy dziergania
          </Button>
        </div>
        <div>
          <Link
            href='/kursy-szydelkowania'
            className={styles.img}
          >
            <div
              className={styles.iconWrapper}
              data-crocheting='true'
            >
              <CrochetingLogo />
            </div>
            <Img
              data={image_crochet}
              sizes='(max-width: 640px) 150px, 300px'
              className={styles.image}
            />
          </Link>
          <Button
            href='/kursy-szydelkowania'
            className={styles.cta}
          >
            Kursy szydełkowania
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EmptyOrders;
