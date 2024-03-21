'use client';
import { useEffect, useMemo } from 'react';
import styles from './LessonHero.module.scss';
import type { Props } from './LessonHero.types';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { updateElement } from '@/utils/update-progress';
import Vimeo from '@u-wave/react-vimeo';

const LessonHero = ({ progress, lesson, course }: Props) => {
  const currentChapter: Props['course']['chapters'][0] = useMemo(() => {
    let curr = course.chapters[0]!;

    course.chapters.every((chapter) => {
      chapter.lessons.forEach((currLesson) => {
        if (currLesson._id === lesson._id) curr = chapter;
      });
      return !curr;
    });

    return curr;
  }, [course, lesson]);

  const currChapterIndex = useMemo(() => {
    let currIndex = 0;

    course.chapters.every((chapter, i) => {
      if (chapter.chapterName === currentChapter.chapterName) currIndex = i;
      return !currIndex;
    });

    return currIndex;
  }, [course, currentChapter]);

  const currentLessonIndex = useMemo(() => {
    let currIndex = 0;

    currentChapter.lessons.every((currLesson, i) => {
      if (currLesson._id === lesson._id) currIndex = i;
      return !currIndex;
    });

    return currIndex;
  }, [currentChapter, lesson]);

  const updateProgress = async () => {
    const currentChapterId = course.chapters[currChapterIndex]!._id;
    const currentLessonId = currentChapter.lessons[currentLessonIndex]!._id;
    await updateElement({
      ...progress,
      progress: {
        ...progress.progress,
        [currentChapterId]: {
          ...progress.progress[currentChapterId],
          [currentLessonId]: {
            notes: '',
            ended: true,
          },
        },
      },
    })
      .then(() => {
        // TODO: check if autoplay enabled
        if (currentChapter.lessons.length > currentLessonIndex + 1)
          window.location.href = `/moje-konto/kursy/${course.slug}/${currentChapter.lessons[currentLessonIndex + 1]!.slug}`;
        else
          window.location.href = `/moje-konto/kursy/${course.slug}/${course.chapters[currChapterIndex + 1]!.lessons[0]!.slug}`;
      })
      .catch(() => {

      });
  };

  useEffect(() => {
    // rework to creating an object with all lessons and chapters and then update progress
    // const newObj = {
    //   ...progress,
    //   progress: course.chapters.reduce(
    //     (acc, el) => {
    //       acc[el._id] = el.lessons.reduce(
    //         (acc, el) => {
    //           acc[el._id] = {
    //             ended: false,
    //             notes: null,
    //           };
    //           return acc;
    //         },
    //         {} as Record<string, { ended: boolean; notes: null }>
    //       );
    //       return acc;
    //     },
    //     {} as Record<string, Record<string, { ended: boolean; notes: null }>>
    //   ),
    // };
    // check if there is new lessons/chapters or some lessons/chapters were removed and update progress
    // const progressChapters = Object.keys(progress.progress.chapters);
    // const courseChapters = course.chapters.map((el) => el._id);
    // const currentChapterId = course.chapters[currChapterIndex]!._id;
    // const currentLessonId = currentChapter.lessons[currentLessonIndex]!._id;
    // const progressLessons = Object.keys(progress.progress.chapters[currentChapterId]!.lessons);
    // const chapterLessons = currentChapter.lessons.map((el) => el._id);
    // debugger
    // if (progressChapters.length !== courseChapters.length) {
    //   const newChapters = courseChapters.filter((el) => !progressChapters.includes(el));
    //   newChapters.forEach((el) => {
    //     progress.progress.chapters[el] = {
    //       lessons: {},
    //     };
    //   });
    // }
    // if (progressLessons.length !== chapterLessons.length) {
    //   const newLessons = chapterLessons.filter((el) => !progressLessons.includes(el));
    //   newLessons.forEach((el) => {
    //     progress.progress.chapters[courseChapters[currChapterIndex]]!.lessons[el] = false;
    //   });
    // }
  }, []);

  return (
    <section className={styles['LessonHero']}>
      <div className={styles['grid']}>
        <div className={styles['content']}>
          <div className={styles.video}>
            <Vimeo
              video={lesson.video}
              loop={false}
              onEnd={updateProgress}
              className={styles['vimeo']}
            />
          </div>
          <nav className={styles.nav}>
            {currentLessonIndex === 0 ? (
              <>
                {currChapterIndex === 0 ? (
                  <div />
                ) : (
                  <Link
                    className={`${styles['prev']} link`}
                    href={`/moje-konto/kursy/${course.slug}/${
                      course.chapters[currChapterIndex - 1]!.lessons[
                        course.chapters[currChapterIndex - 1]!.lessons.length - 1
                      ]!.slug
                    }`}
                  >
                    Poprzedni rozdział
                  </Link>
                )}
              </>
            ) : (
              <Link
                className={`${styles['prev']} link`}
                href={`/moje-konto/kursy/${course.slug}/${currentChapter.lessons[currentLessonIndex - 1]!.slug}`}
              >
                Poprzednia lekcja
              </Link>
            )}
            <Button onClick={updateProgress}>Oznacz jako ukończoną</Button>
            {currentChapter.lessons.length > currentLessonIndex + 1 ? (
              <Link
                className={`${styles['next']} link`}
                href={`/moje-konto/kursy/${course.slug}/${currentChapter.lessons[currentLessonIndex + 1]!.slug}`}
              >
                Następna lekcja
              </Link>
            ) : (
              <>
                {currChapterIndex === course.chapters.length - 1 ? (
                  <div />
                ) : (
                  <Link
                    className={`${styles['next']} link`}
                    href={`/moje-konto/kursy/${course.slug}/${course.chapters[currChapterIndex + 1]!.lessons[0]!.slug}`}
                  >
                    Następny rozdział
                  </Link>
                )}
              </>
            )}
          </nav>
        </div>
        <div>
          <div className={styles.progress}>
            <h1>{course.name}</h1>
            <p>Ukończono 0%</p>
          </div>
          <p className={styles['chapter']}>
            <span>Moduł {currChapterIndex + 1}:</span> {currentChapter.chapterName}
          </p>
          <div className={styles.lessons}>
            {currentChapter.lessons.map((el, i) => (
              <Link
                href={`/moje-konto/kursy/${course.slug}/${el.slug}`}
                key={i}
                aria-current={el.slug === lesson.slug}
              >
                <small>Lekcja {i + 1}</small> {el.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LessonHero;
