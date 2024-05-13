import Img from '@/components/ui/image';
import styles from './EmptyFiles.module.scss';
import type { EmptyFilesTypes } from './EmptyFiles.types';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { FirstBadge, SecondBadge } from '@/components/ui/Icons';

const EmptyFiles = ({ image_crochet, image_knitting }: EmptyFilesTypes) => {
  return (
    <section className={styles['EmptyFiles']}>
      <h2>
        W tym miejscu znajdziesz <strong>pliki z kursów do pobrania.</strong>
      </h2>
      <p>Póki co wieje tu pustką, wróć tutaj, gdy kupisz jakiś kurs</p>
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

export default EmptyFiles;
