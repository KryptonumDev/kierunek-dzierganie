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
import { createClientComponentClient } from '';
import parseFileName from '@/utils/parse-file-name';

const LessonHero = ({
  progress,
  lesson,
  course,
  currentChapter,
  currentChapterIndex,
  currentLessonIndex,
  left_handed,
  id,
}: Props) => {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [leftHanded, setLeftHanded] = useState(left_handed);
  const [autoplay, setAutoplay] = useState(false);
  const [isCompleted, setIsCompleted] = useState(
    () => progress.progress[currentChapter._id]![lesson._id]?.ended ?? false
  );
  const completePercentage = useMemo(() => {
    const totalLessons = currentChapter.lessons.length;
    let completedLessons = 0;

    currentChapter.lessons.forEach((lesson) => {
      if (progress.progress[currentChapter._id]![lesson._id]?.ended) completedLessons++;
    });

    return Math.round((completedLessons / totalLessons) * 100);
  }, [currentChapter, progress]);

  const updateProgress = async (type: 'manual' | 'auto', ended: boolean) => {
    const currentChapterId = currentChapter._id;
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

        // check if  course progress is 100%

        if (ended) {
          let completedChapters = 0;
          for (const chapterId in progress.progress) {
            let completedLessons = 0;
            for (const lessonId in progress.progress[chapterId]) {
              if (progress.progress[chapterId]![lessonId]!.ended || lessonId === currentLessonId) completedLessons++;
            }
            if (completedLessons === course.chapters.find((el) => el._id === chapterId)!.lessons.length)
              completedChapters++;
          }
          if (completedChapters === course.chapters.length) {
            router.push(`/moje-konto/kursy/${course.slug}/certyfikat`);
          }
        }

        if (!autoplay && type === 'auto') return;

        if (type === 'manual') {
          router.refresh();
          return;
        }

        if (currentChapter.lessons.length > currentLessonIndex + 1)
          router.push(`/moje-konto/kursy/${course.slug}/${currentChapter.lessons[currentLessonIndex + 1]!.slug}`);
        else
          router.push(`/moje-konto/kursy/${course.slug}/${course.chapters[currentChapterIndex + 1]!.lessons[0]!.slug}`);
      })
      .catch(() => {});
  };

  const setIsLeftHanded = async (isLeftHanded: boolean) => {
    await supabase
      .from('profiles')
      .update({
        left_handed: isLeftHanded,
      })
      .eq('id', id);

    setLeftHanded(isLeftHanded);
  };

  return (
    <section className={styles['LessonHero']}>
      <div className={styles['grid']}>
        <Link
          className={`${styles.returnLink} link`}
          href={'/moje-konto/kursy'}
        >
          <ChevronRight />
          Wszystkie kursy
        </Link>
        <div className={styles['content']}>
          <div className={styles.video}>
            {leftHanded ? (
              <Vimeo
                video={lesson.video_alter}
                loop={false}
                onEnd={() => updateProgress('auto', true)}
                className={styles['vimeo']}
              />
            ) : (
              <Vimeo
                video={lesson.video}
                loop={false}
                onEnd={() => updateProgress('auto', true)}
                className={styles['vimeo']}
              />
            )}
          </div>
          <nav className={styles.nav}>
            {currentLessonIndex === 0 ? (
              <>
                {currentChapterIndex === 0 ? (
                  <div />
                ) : (
                  <Link
                    className={`${styles['prev']} link`}
                    href={`/moje-konto/kursy/${course.slug}/${
                      course.chapters[currentChapterIndex - 1]!.lessons[
                        course.chapters[currentChapterIndex - 1]!.lessons.length - 1
                      ]!.slug
                    }`}
                  >
                    Poprzedni moduł
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
                {currentChapterIndex === course.chapters.length - 1 && isCompleted && (
                  <Link
                    className={`${styles['next']} link`}
                    href={`/moje-konto/kursy/${course.slug}/certyfikat`}
                  >
                    Podsumowanie kursu
                  </Link>
                )}
                {currentChapterIndex != course.chapters.length - 1 && (
                  <Link
                    className={`${styles['next']} link`}
                    href={`/moje-konto/kursy/${course.slug}/${course.chapters[currentChapterIndex + 1]!.lessons[0]!.slug}`}
                  >
                    Następny moduł
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
            <span>Moduł {currentChapterIndex + 1}:</span> {currentChapter.chapterName}
          </p>
          <div className={styles.lessonsWrapper}>
            <div className={styles.lessons}>
              {currentChapter.lessons.map((el, i) => {
                return (
                  <Link
                    href={`/moje-konto/kursy/${course.slug}/${el.slug}`}
                    key={i}
                    aria-current={el.slug === lesson.slug}
                    aria-checked={progress.progress[currentChapter._id]![el._id]?.ended}
                  >
                    <p>
                      {progress.progress[currentChapter._id]![el._id]?.ended && <CheckIcon />}
                      <small>Lekcja {i + 1}</small>
                    </p>{' '}
                    {el.title}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className={styles['columns']}>
        <div className={styles['column']}>
          <Switch inputProps={{ onClick: () => setAutoplay(!autoplay) }}>Autoodtwarzanie</Switch>
          <Switch inputProps={{ checked: leftHanded, onClick: () => setIsLeftHanded(!leftHanded) }}>
            Jestem osobą leworęczną
          </Switch>
          <p>Ustawienie to dostosowuje w jaki sposób wyświetlają Ci się kursy i pliki do lekcji</p>
        </div>
        <div className={styles['column']}>
          {(lesson.files_alter || lesson.files) && <h2>Pliki do pobrania</h2>}
          <ul className={styles['list']}>
            {leftHanded ? (
              <>
                {lesson.files_alter?.map((el) => (
                  <li key={el.asset._id}>
                    <a
                      href={el.asset.url}
                      className='link'
                      download
                      target='_blank'
                      rel='noreferrer noopener'
                    >
                      {parseFileName(el.asset.originalFilename)} <small>({formatBytes(el.asset.size)})</small>
                    </a>
                  </li>
                ))}
              </>
            ) : (
              <>
                {lesson.files?.map((el) => (
                  <li key={el.asset._id}>
                    <a
                      href={el.asset.url}
                      className='link'
                      download
                    >
                      {parseFileName(el.asset.originalFilename)} <small>({formatBytes(el.asset.size)})</small>
                    </a>
                  </li>
                ))}
              </>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default LessonHero;

function ChevronRight() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='20'
      height='20'
      fill='none'
    >
      <path
        stroke='#B4A29C'
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M12.813 4.375L7.186 10l5.625 5.625'
      ></path>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='20'
      height='21'
      fill='none'
    >
      <path
        stroke='#5C7360'
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M16.25 5.97l-8.75 10-3.75-3.75'
      ></path>
    </svg>
  );
}
