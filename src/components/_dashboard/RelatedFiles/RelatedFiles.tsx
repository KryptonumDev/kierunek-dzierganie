import styles from './RelatedFiles.module.scss';
import type { RelatedFilesTypes } from './RelatedFiles.types';

const RelatedFiles = ({ course, courses_progress }: RelatedFilesTypes) => {
  return (
    <section
      id='materialy-do-pobrania'
      className={styles['RelatedFiles']}
    >
      <h2>Materiały do pobrania</h2>
      <div className={styles.container}>
        <FilesColumn heading='Materiały do kursu' />
        <FilesColumn heading='Twoje Pliki' />
      </div>
    </section>
  );
};

export default RelatedFiles;

const FilesColumn = ({ heading }: { heading: string }) => {
  return (
    <div className={styles.filesColumns}>
      <h3>{heading}</h3>
    </div>
  );
};
