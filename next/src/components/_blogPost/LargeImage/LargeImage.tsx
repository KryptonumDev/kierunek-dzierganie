import { ImgType } from '@/global/types';
import styles from './LargeImage.module.scss';
import Img from '@/components/ui/image';

const LargeImage = (img: ImgType) => {
  return (
    <Img
      data={img}
      sizes='100vw'
      className={styles['LargeImage']}
    />
  );
};

export default LargeImage;
