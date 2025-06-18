import FileItem from '@/components/ui/FileItem';
import RelatedNotes from '../RelatedNotes';
import styles from './RelatedFiles.module.scss';
import type { RelatedFilesTypes } from './RelatedFiles.types';

const RelatedFiles = ({ course, left_handed, notes }: RelatedFilesTypes) => {
  const files = left_handed ? course.files_alter : course.files;

  if (!files?.length) return null;

  return (
    <section
      id='materialy-do-pobrania'
      className={styles['RelatedFiles']}
    >
      <h2>Materiały do pobrania</h2>
      <div className={styles.container}>
        <FilesColumn heading='Instrukcje do kursu'>
          {files?.map((el, i) => (
            <FileItem
              file={el}
              key={i}
            />
          ))}
        </FilesColumn>
        {!!notes.length && (
          <FilesColumn heading='Twoje Pliki'>
            <RelatedNotes
              notes={notes}
              courseName={course.name}
            />
          </FilesColumn>
        )}
      </div>
    </section>
  );
};

export default RelatedFiles;

const FilesColumn = ({ heading, children }: { heading: string; children: React.ReactNode }) => {
  return (
    <div>
      <h3>{heading}</h3>
      <div className={styles.list}>{children}</div>
    </div>
  );
};
