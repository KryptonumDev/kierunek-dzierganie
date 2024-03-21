'use client';
import { useMemo, useState } from 'react';
import styles from './LessonHero.module.scss';
import type { Props } from './LessonHero.types';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { updateElement } from '@/utils/update-progress';
import Vimeo from '@u-wave/react-vimeo';
import PercentChart from '@/components/ui/PercentChart';
import { formatBytes } from '@/utils/format-bytes';
import Switch from '@/components/ui/Switch';
import { useRouter } from 'next/navigation';

const LessonHero = ({ progress, lesson, course }: Props) => {
  const router = useRouter();
  const [leftHanded, setLeftHanded] = useState(false);
  const [autoplay, setAutoplay] = useState(false);
  const [isCompleted, setIsCompleted] = useState(
    () => progress.progress[course.chapters[0]!._id]![lesson._id]?.ended ?? false
  );

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

  const completePercentage = useMemo(() => {
    const totalLessons = currentChapter.lessons.length;
    let completedLessons = 0;

    currentChapter.lessons.forEach((lesson) => {
      if (progress.progress[currentChapter._id]![lesson._id]?.ended) completedLessons++;
    });

    return Math.round((completedLessons / totalLessons) * 100);
  }, [currentChapter, progress]);

  const updateProgress = async (type: 'manual' | 'auto', ended: boolean) => {
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
            ended: ended,
          },
        },
      },
    })
      .then(() => {
        setIsCompleted(ended);
        if (!autoplay && type === 'auto') return;

        if(type === 'manual'){
          router.refresh();
          return;
        }

        if (currentChapter.lessons.length > currentLessonIndex + 1)
          window.location.href = `/moje-konto/kursy/${course.slug}/${currentChapter.lessons[currentLessonIndex + 1]!.slug}`;
        else
          window.location.href = `/moje-konto/kursy/${course.slug}/${course.chapters[currChapterIndex + 1]!.lessons[0]!.slug}`;
      })
      .catch(() => {});
  };

  // useEffect(() => {
  //   // check if there is new lessons/chapters or some lessons/chapters were removed and update progress
  //   // rework to creating an object with all lessons and chapters and then update progress
  //   // const newObj = {
  //   //   ...progress,
  //   //   progress: course.chapters.reduce(
  //   //     (acc, el) => {
  //   //       acc[el._id] = el.lessons.reduce(
  //   //         (acc, el) => {
  //   //           acc[el._id] = {
  //   //             ended: false,
  //   //             notes: null,
  //   //           };
  //   //           return acc;
  //   //         },
  //   //         {} as Record<string, { ended: boolean; notes: null }>
  //   //       );
  //   //       return acc;
  //   //     },
  //   //     {} as Record<string, Record<string, { ended: boolean; notes: null }>>
  //   //   ),
  //   // };
  // }, []);

  return (
    <section className={styles['LessonHero']}>
      <div className={styles['grid']}>
        <div className={styles['content']}>
          <div className={styles.video}>
            <Vimeo
              video={lesson.video}
              loop={false}
              onEnd={() => updateProgress('auto', true)}
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
            {isCompleted ? (
              <Button onClick={() => updateProgress('manual', false)}>Oznacz jako nieukończoną</Button>
            ) : (
              <Button onClick={() => updateProgress('manual', true)}>Oznacz jako ukończoną</Button>
            )}
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
            <p>
              Ukończono <PercentChart p={completePercentage} />
            </p>
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
      <div className={styles['columns']}>
        <div className={styles['column']}>
          <Switch inputProps={{ onClick: () => setAutoplay(!autoplay) }}>Autoodtwarzanie</Switch>
          <Switch inputProps={{ onClick: () => setLeftHanded(!leftHanded) }}>Jestem osobą leworęczną</Switch>
          <p>Ustawienie te dostosowuje w jaki sposób wyświetlają Ci się kursy i pliki do lekcji</p>
        </div>
        <div className={styles['column']}>
          <h2>Pliki do pobrania</h2>
          <ul className={styles['list']}>
            {lesson.files?.map((el) => (
              <li key={el.asset._id}>
                <a
                  href={el.asset.url}
                  className='link'
                  download
                >
                  {el.asset.originalFilename} <small>({formatBytes(el.asset.size)})</small>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default LessonHero;
