import Img from '@/components/ui/image';
import styles from './EmptyFiles.module.scss';
import type { EmptyFilesTypes } from './EmptyFiles.types';
import Button from '@/components/ui/Button';

const EmptyFiles = ({ image_crochet, image_knitting }: EmptyFilesTypes) => {
  return (
    <section className={styles['EmptyFiles']}>
      <h2>
        W tym miejscu znajdziesz <strong>pliki z kursów do pobrania.</strong>
      </h2>
      <p>Póki co wieje tu pustką, wróć tutaj, gdy kupisz jakiś kurs</p>
      <div className={styles['grid']}>
        <div>
          <Img
            data={image_knitting}
            sizes='(max-width: 640px) 150px, 300px'
          />
          <Button href='/dzierganie-na-drutach'>Dzierganie</Button>
        </div>
        <div>
          <Img
            data={image_crochet}
            sizes='(max-width: 640px) 150px, 300px'
          />
          <Button href='/szydelkowanie'>Szydełkowanie</Button>
        </div>
      </div>
    </section>
  );
};

export default EmptyFiles;
