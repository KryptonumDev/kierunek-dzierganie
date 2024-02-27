import { formatBytes } from '@/utils/format-bytes';
import styles from './FilesComponent.module.scss';
import type { Props } from './FilesComponent.types';

const FilesComponent = ({ data }: Props) => {
  return (
    <section className={styles['FilesComponent']}>
      {data.map(({ asset: { originalFilename, size, url } }, index) => (
        <div
          className={styles.linkWrapper}
          key={index}
        >
          <a
            href={`${url}?dl=${originalFilename}`}
            className='link'
          >
            {originalFilename}
          </a>
          <span className={styles.fileSize}>{`(${formatBytes(size)})`}</span>
        </div>
      ))}
    </section>
  );
};

export default FilesComponent;
