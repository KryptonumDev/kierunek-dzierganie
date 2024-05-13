import Button from '@/components/ui/Button';
import styles from './EmptyCourses.module.scss';
import type { Props } from './EmptyCourses.types';
import Img from '@/components/ui/image';
import Link from 'next/link';
import { FirstBadge, SecondBadge } from '@/components/ui/Icons';

const EmptyCourses = ({ image_crochet, image_knitting }: Props) => {
  return (
    <section className={styles['EmptyCourses']}>
      <h2 className='h1'>
        Moje <strong>kursy</strong>
        <span className={styles['count']}>0</span>
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
            <div className={styles.badgeWrapper}>
              <FirstBadge />
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
            Dzierganie
          </Button>
        </div>
        <div>
          <Link
            href='/kursy-szydelkowania'
            className={styles.img}
          >
            <div className={styles.badgeWrapper}>
              <SecondBadge />
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
            Szydełkowanie
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EmptyCourses;
