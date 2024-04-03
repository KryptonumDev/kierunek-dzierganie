import Button from '@/components/ui/Button';
import styles from './EmptyCourses.module.scss';
import type { Props } from './EmptyCourses.types';
import Img from '@/components/ui/image';

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
          <Img
            data={image_knitting}
            sizes='(max-width: 640px) 150px, 300px'
          />
          <Button href='/kursy-dziergania-na-drutach'>Dzierganie</Button>
        </div>
        <div>
          <Img
            data={image_crochet}
            sizes='(max-width: 640px) 150px, 300px'
          />
          <Button href='/kursy-szydelkowania'>Szydełkowanie</Button>
        </div>
      </div>
    </section>
  );
};

export default EmptyCourses;
