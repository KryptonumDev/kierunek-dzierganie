import styles from './TableOfContent.module.scss';
import type { TableOfContentTypes } from './TableOfContent.types';

const prettifyDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours === 0) {
    return `${remainingMinutes} min. oglądania`;
  } else if (remainingMinutes === 0) {
    return `${hours} godz. oglądania`;
  } else {
    return `${hours} godz. ${remainingMinutes} min. oglądania`;
  }
};

const TableOfContent = ({ chapters }: TableOfContentTypes) => {
  return (
    <section className={styles['TableOfContent']}>
      {chapters.map(({ chapterName, lessons }, i) => {
        const chapterDuration = prettifyDuration(lessons.reduce((acc, lesson) => acc + lesson.lengthInMinutes, 0));
        return (
          <div
            className={styles.chapter}
            key={i}
          >
            <div className={styles.header}>
              <p className={styles.headerBadge}>
                <span>Moduł</span>
                <span>{i + 1}</span>
              </p>
              <h2 className='h3'>{chapterName}</h2>
            </div>
            <ol className={styles.lessons}>
              {lessons.map(({ title }, i) => (
                <li
                  key={i}
                  className={styles.item}
                >
                  <span>Lekcja {i + 1}</span>
                  <span>{title}</span>
                </li>
              ))}
            </ol>
            <p className={styles.duration}>{chapterDuration}</p>
          </div>
        );
      })}
    </section>
  );
};

export default TableOfContent;
