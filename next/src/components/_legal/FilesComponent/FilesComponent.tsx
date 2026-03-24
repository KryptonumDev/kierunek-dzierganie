import { formatBytes } from '@/utils/format-bytes';
import styles from './FilesComponent.module.scss';
import type { Props } from './FilesComponent.types';
import parseFileName from '@/utils/parse-file-name';

const FilesComponent = ({ data }: Props) => {
  if (!data || data.length === 0) return null;
  return (
    <section className={styles['FilesComponent']}>
      {data.map(({ asset: { originalFilename, size, url } }, index) => (
        <div
          className={styles.linkWrapper}
          key={index}
        >
          <a
            href={`${parseFileName(url)}?dl=${parseFileName(originalFilename)}`}
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
