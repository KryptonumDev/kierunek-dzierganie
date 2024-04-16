import Markdown from '@/components/ui/markdown';
import styles from './LessonDescription.module.scss';
import type { LessonDescriptionTypes } from './LessonDescription.types';
import Img from '@/components/ui/image';

const LessonDescription = ({ lesson }: LessonDescriptionTypes) => {
  if (!lesson.description) return null;
  return (
    <section className={styles['LessonDescription']}>
      <h2>
        Czego się dzisiaj <strong>nauczysz</strong>
      </h2>
      <Markdown>{lesson.description}</Markdown>
      <div className={styles['grid']}>
        {lesson.flex?.map((item, index) => (
          <div
            key={index}
            className={`${styles['item']} ${index % 2 === 0 ? styles['left'] : styles['right']}`}
          >
            <div>
              <Markdown.h3>{item.title}</Markdown.h3>
              <Markdown>{item.description}</Markdown>
            </div>
            <Img
              sizes='485px'
              data={item.img}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default LessonDescription;
